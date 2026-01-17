import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || 3000),

  REDIS_URL: process.env.REDIS_URL!,
  
  DB_HOST: process.env.DB_HOST!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,

  WORKER_CONCURRENCY: Number(process.env.WORKER_CONCURRENCY || 5),
  MAX_EMAILS_PER_SECOND: Number(process.env.MAX_EMAILS_PER_SECOND || 1),
  MAX_EMAILS_PER_HOUR_PER_SENDER: Number(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || 200),

  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: Number(process.env.SMTP_PORT),
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!
};
