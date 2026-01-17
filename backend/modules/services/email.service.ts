import { emailQueue } from "../queues/email.queue";
import { db } from "../../config/db";

export async function scheduleEmail(data: {
  to: string;
  subject: string;
  body: string;
  sendAt: Date;
  senderId: number;
}) {
  const [result] = await db.execute(
    `INSERT INTO emails (to_email, subject, body, send_at, sender_id, status)
     VALUES (?, ?, ?, ?, ?, 'scheduled')`,
    [data.to, data.subject, data.body, data.sendAt, data.senderId]
  );

  const emailId = (result as any).insertId;

  const delay = data.sendAt.getTime() - Date.now();

  await emailQueue.add(
    "send-email",
    {
      emailId,
      to: data.to,
      subject: data.subject,
      body: data.body,
    },
    {
      delay: Math.max(delay, 0),
    }
  );

  return emailId;
}

export async function markEmailAsSent(emailId: number) {
  await db.execute(
    `UPDATE emails SET status='sent', sent_at=NOW() WHERE id=?`,
    [emailId]
  );
}

export async function rescheduleEmail(emailId: number) {
  const nextHour = new Date();
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

  await db.execute(
    `UPDATE emails SET send_at=? WHERE id=?`,
    [nextHour, emailId]
  );
}
