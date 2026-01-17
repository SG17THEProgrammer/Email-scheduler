import { EmailRepository } from "../email/email.repository";
import { sendEmail } from "../services/mailer.service";
import { SchedulerService } from "../services/scheduler.service";
import { env } from "../../config/env";

const repo = new EmailRepository();
const scheduler = new SchedulerService();

/**
 * In-memory rate limiter
 * key: senderId-hourKey
 * value: count
 */
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function getHourKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}-${date.getUTCHours()}`;
}

/**
 * Rate limiter without Redis
 */
async function canSend(senderId: number): Promise<boolean> {
  const hourKey = getHourKey();
  const key = `${senderId}-${hourKey}`;
  const now = Date.now();

  const existing = rateLimitMap.get(key);

  if (!existing || existing.expiresAt < now) {
    rateLimitMap.set(key, {
      count: 1,
      expiresAt: now + 60 * 60 * 1000 // 1 hour
    });
    return true;
  }

  if (existing.count >= env.MAX_EMAILS_PER_HOUR_PER_SENDER) {
    return false;
  }

  existing.count += 1;
  return true;
}

/**
 * BullMQ processor
 */
export async function processor(job: any) {
  console.log("🔔 Job picked by worker:", job.id, job.data);

  const email = await repo.findById(job.data.emailId);
  console.log("📧 Email fetched:", email);

  if (!email || email.status === "sent") {
    console.log("⚠️ Email missing or already sent");
    return;
  }

  const allowed = await canSend(email.sender_id);
  console.log("🚦 Rate limit allowed:", allowed);

  if (!allowed) {
    // retry after 1 hour
    console.log("⏳ Rate limit exceeded, rescheduling");
    await scheduler.enqueue(
      email.id,
      new Date(Date.now() + 60 * 60 * 1000)
    );
    return;
  }
  console.log("📤 Sending email...");
  await sendEmail({
    to: email.to_email,
    subject: email.subject,
    body: email.body,
  });

  console.log("✅ Marking email as sent");
  await repo.markSent(email.id);
}
