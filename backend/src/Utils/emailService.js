import nodemailer from "nodemailer";

// Nodemailer setup
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your_email@gmail.com
      pass: process.env.EMAIL_PASS, // app password
    },
  });
} catch (err) {
  console.error("Failed to create email transporter:", err);
  transporter = null;
}

// Send OTP email
export const sendOtpEmail = async (email, otp) => {
  // If transporter is not available, skip sending email
  if (!transporter) {
    console.warn("Email transporter not available, skipping email send");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Payment",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    // Don't throw the error to prevent order creation failure
    // Just log it and continue
  }
};

export default { sendOtpEmail };
