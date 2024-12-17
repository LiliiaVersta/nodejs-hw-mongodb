import nodemailer from 'nodemailer';

export const sendEmail = async ({ from, to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    return false;
  }
};
