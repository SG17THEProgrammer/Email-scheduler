import nodemailer from "nodemailer";

type MailAttachment = {
  filename: string;
  path: string;
  contentType?: string;
};

const transporterPromise = nodemailer.createTestAccount().then((account) =>
  nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  })
);

export async function sendEmail({
  to,
  subject,
  body,
   attachments,
}: {
  to: string;
  subject: string;
  body: string;
  attachments?: MailAttachment[];
}) {
  const transporter = await transporterPromise;

  console.log(to);

  const info = await transporter.sendMail({
    from: '"Scheduler" <no-reply@test.com>',
    to,
    subject,
    html: body,
    attachments,
  });

  console.log("📧 Email sent:", nodemailer.getTestMessageUrl(info));
}
