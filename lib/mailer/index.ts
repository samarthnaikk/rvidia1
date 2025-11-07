import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  return transporter;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      console.error("Gmail credentials not configured");
      return false;
    }

    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
