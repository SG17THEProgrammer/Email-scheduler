import { db } from "../../config/db";

export class EmailRepository {
  async create(data: any) {
    const [result] = await db.query(
      `INSERT INTO emails 
      (sender_id, to_email, subject, body, scheduled_at) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        data.senderId,
        data.to,
        data.subject,
        data.body,
        data.scheduledAt
      ]
    );

    // @ts-ignore
    return { id: result.insertId, ...data };
  }

  async findById(id: number) {
    const [rows] = await db.query(
      "SELECT * FROM emails WHERE id = ?",
      [id]
    );
    // @ts-ignore
    return rows[0];
  }

  async markSent(id: number) {
    await db.query(
      "UPDATE emails SET status='sent', sent_at=NOW() WHERE id=?",
      [id]
    );
  }
}
