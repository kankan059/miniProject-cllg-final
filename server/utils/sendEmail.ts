import nodemailer from "nodemailer";

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"Event Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}