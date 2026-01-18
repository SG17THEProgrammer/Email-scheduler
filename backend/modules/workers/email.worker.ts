import { Worker, Job } from "bullmq";
import { redisConnection } from "../../config/redis";
import { EMAIL_QUEUE_NAME } from "../queues/email.queue";
import { sendEmail } from "../services/mailer.service";
import { rescheduleEmail } from "../services/email.service";
import { EmailRepository } from "../email/email.repository";
import { processor } from "./email.processor";


const repo = new EmailRepository();


export const emailWorker = new Worker(
  EMAIL_QUEUE_NAME,
  processor,
  // async (job: Job) => {
  //   console.log("job", job);
  //   const { emailId } = job.data;

  //   if (!emailId) {
  //     throw new Error("emailId missing in job data");
  //   }
  //   const email = await repo.findById(emailId);
  //   // const data = await repo.findById(emailId);
  //   // console.log(data);

  //   try {
  //     await sendEmail({
  //       to: email.to_email,   
  //       subject: email.subject,
  //       body: email.body,
  //     });
  //     await markEmailAsSent(emailId);
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  {
    connection: redisConnection,

    limiter: {
      max: Number(process.env.MAX_EMAILS_PER_HOUR || 200),
      duration: 60 * 60 * 1000,
    },

    concurrency: Number(process.env.WORKER_CONCURRENCY || 5),
  }
);

emailWorker.on("ready", () => {
  console.log("Worker connected to Redis");
});

emailWorker.on("error", (err) => {
  console.error("Worker error", err);
});


emailWorker.on("failed", async (job, err) => {
  console.error(`Job ${job?.id} failed`, err);

  if (err) {
    await rescheduleEmail(job!.data.emailId);
  }
});
