import { Request, Response } from "express";
import { EmailService } from "./email.service";
import { validateSchedule } from "./email.validator";
import { db } from "../../config/db";

const service = new EmailService();

export async function scheduleEmail(req: Request, res: Response) {
  const data = validateSchedule(req.body);
  const email = await service.schedule(data);
  res.json(email);
}
export async function getEmails(req: Request, res: Response) {
  const status = req.query.status;
  const [mails] = await db.query(
      "SELECT * FROM emails WHERE status=?",
      [status]
    );
  res.json(mails);
}
