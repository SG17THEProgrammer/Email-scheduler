import { emailQueue } from "../queues/email.queue";

export class SchedulerService {
  async enqueue(emailId: number, scheduledAt: Date) {
    console.log("emailId" , emailId);
    const delay =
      scheduledAt.getTime() - Date.now();

    await emailQueue.add(
      "send-email",
      { emailId },
      {
        delay: Math.max(delay, 0),
        jobId: `email-${emailId}`
      }
    );
  }
}
