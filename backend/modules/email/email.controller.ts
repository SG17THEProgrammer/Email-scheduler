import { Request, Response } from "express";
// import { EmailService } from "./email.service";
import { validateSchedule } from "./email.validator";
import { db } from "../../config/db";
import { upload } from "../middleware/upload";
import { scheduleMail } from "../services/email.service";
// const service = new EmailService();

export async function scheduleEmail(req: Request, res: Response) {
  try {
    const payload = {
      senderId: req.body.user?.user?.id ?? 0,
      to: req.body.to ?? req.body.emails ?? [],
      subject: req.body.subject,
      body: req.body.body,
      scheduledAt: req.body.scheduledAt,
      sendAt: req.body.sendAt ?? new Date(),
      emails: req.body.emails,
      user: req.body.user,
    };

    const data = validateSchedule(payload);
    const email = await scheduleMail(data);
    res.json(email);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Invalid data" });
  }
}
export async function getEmails(req: Request, res: Response) {
  const status = req.query.status;
  const [mails] = await db.query(
    "SELECT * FROM emails WHERE status=?",
    [status]
  );
  res.json(mails);
}
export async function getEmailById(req: Request, res: Response) {
  const id = req.body.id;
  const [mail] = await db.query(
    "SELECT * FROM emails WHERE id=?",
    [id]
  );
  res.json(mail);
}

export async function uploadAttachments(req: Request, res: Response) {
  upload.array("attachments", 10),
    async (req: Request, res: Response) => {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const attachments = files.map((file) => ({
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
      }));

      res.json(attachments);
    }

}