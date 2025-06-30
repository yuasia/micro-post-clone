import * as nodemailer from 'nodemailer';

export async function sendOTPEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"MicroPost" <${process.env.SMTP_USER}>`,
      to: to,
      subject: '【MicroPost】Your OTP Code',
      text: `Your one time password is: ${otp}. It is valid for 5 minutes.`,
    });

    console.log('OTP email sent successfully: %s', info.messageId);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error(`OTP email sending failed: ${error.message}`);
  }
}
