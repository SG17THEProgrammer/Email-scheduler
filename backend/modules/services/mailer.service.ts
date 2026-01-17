import nodemailer from "nodemailer";

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
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const transporter = await transporterPromise;

  console.log(to);

  const info = await transporter.sendMail({
    from: '"Scheduler" <no-reply@test.com>',
    to,
    subject,
    html: body,
  });

  console.log("📧 Email sent:", nodemailer.getTestMessageUrl(info));
}
