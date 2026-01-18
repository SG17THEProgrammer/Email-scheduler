import { emailQueue } from "../queues/email.queue";
import { db } from "../../config/db";
import { User } from "../email/email.types";


export async function ensureSenderExists(user: {
  id: number;
  name: string;
  email: string;
  // smtp_user?: string;
  // smtp_pass?: string;
}) {
  const [rows]: any = await db.query(
    `SELECT * FROM senders WHERE id = ?`,
    [user.id]
  );

  if (rows.length === 0) {
    // Insert sender for the first time
    await db.query(
      `INSERT INTO senders
        (id, name, email, created_at) 
        VALUES (?, ?, ?, NOW())`,
      [user.id, user.name, user.email]
    );
  }
}

export async function scheduleMail(data: {
  emails?: string[];
  to: string[];
  subject: string;
  body: string;
  sendAt?: Date;
  scheduledAt: Date;
  senderId: number;
  user: User
  // attachments?: {
  //   file_name: string;
  //   file_type: string;
  //   file_size: number;
  //   file_url: string;
  // }[];
}) {
  const connection = await db.getConnection();
  console.log(data);
  try {
    await connection.beginTransaction();

    // Ensure sender exists
    await ensureSenderExists({
      id: data.user.user.id,
      name: data.user.user.name,
      email: data.user.user.email, // or actual sender email
    });

    const toEmails = data.to.join(",");

    /*  Insert email */
    const [result]: any = await connection.execute(
      `INSERT INTO emails 
        (to_email, subject, body, sent_at, scheduled_at, sender_id, status)
        VALUES (?, ?, ?, ?, ?,?, 'scheduled')`,
      [
        toEmails,
        data.subject,
        data.body,
        data.sendAt,
        data.scheduledAt,
        data.senderId,
      ]
    );

    const emailId = result.insertId;

    /*  Insert attachments (if any) */
    // if (data.attachments && data.attachments.length > 0) {
    //   for (const file of data.attachments) {
    //     await connection.execute(
    //       `INSERT INTO email_attachments
    //       (email_id, file_name, file_type, file_size, file_url)
    //       VALUES (?, ?, ?, ?, ?)`,
    //       [
    //         emailId,
    //         file.file_name,
    //         file.file_type,
    //         file.file_size,
    //         file.file_url,
    //       ]
    //     );
    //   }
    // }

    await connection.commit();

    /*  Queue email */
    const delay = data.scheduledAt.getTime() - Date.now();

    await emailQueue.add(
      "send-email",
      {
        emailId,
        to: data.to,
        subject: data.subject,
        body: data.body,
      },
      {
        jobId: `send-email-${emailId}`, // job-id
        delay: Math.max(delay, 0),
      }
    );

    // await emailQueue.add(
    //   "send-email",
    //   email.id ,
    //   {
    //     delay: Math.max(delay, 0),
    //     jobId: `email-${ email.id}`
    //   }
    // );

    return emailId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}


// export async function markEmailAsSent(emailId: number) {
//   await db.execute(
//     `UPDATE emails SET status='sent', sent_at=NOW() WHERE id=?`,
//     [emailId]
//   );
// }

// export async function rescheduleEmail(emailId: number) {
//   const nextHour = new Date();
//   nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

//   await db.execute(
//     `UPDATE emails SET sent_at=? WHERE id=?`,
//     [nextHour, emailId]
//   );
// }

export async function rescheduleEmail(emailId: number) {
  const nextTime = new Date();
  nextTime.setMinutes(nextTime.getMinutes() + 2);
  nextTime.setSeconds(0, 0); // optional: round to exact minute

  await db.execute(
    `UPDATE emails SET sent_at = ? WHERE id = ?`,
    [nextTime, emailId]
  );
}

