import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (recipient, subject, content) => {
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS is set:", !!process.env.SMTP_PASS);

  const info = await transporter.sendMail({
    from: `"PROCODE CRM" <${process.env.SMTP_USER}>`,
    to: recipient,
    subject: subject,
    html: content,
  });

  console.log("Message sent:", info.messageId);
};

export { sendEmail };
