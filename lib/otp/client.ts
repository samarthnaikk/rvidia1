import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    console.log("Attempting to send OTP to:", email);
    console.log("Gmail user configured:", !!process.env.GMAIL_USER);

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      console.error("Gmail credentials not configured in .env");
      return false;
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your RVIDIA OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your One-Time Password (OTP) for RVIDIA account verification is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="color: #0066cc; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  resetLink: string
): Promise<boolean> {
  try {
    console.log("Attempting to send password reset email to:", email);

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      console.error("Gmail credentials not configured in .env");
      return false;
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "RVIDIA Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>We received a request to reset your RVIDIA account password.</p>
          <p>Your password reset OTP is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="color: #0066cc; letter-spacing: 5px; margin: 0;">${resetToken}</h1>
          </div>
          <p style="color: #666;">This code will expire in 15 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email or change your password immediately.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return false;
  }
}
