import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendMagicLinkEmail(
  email: string,
  name: string,
  token: string
) {
  const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your DriveUnity Sign-In Link',
    html: `
      <h2>Hi ${name}!</h2>
      <p>Click the link below to sign in:</p>
      <a href="${magicLink}">Sign In to DriveUnity</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });
}

export async function sendOTPEmail(
  email: string,
  name: string,
  code: string
) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your DriveUnity Verification Code',
    html: `
      <h2>Hi ${name}!</h2>
      <p>Your verification code is:</p>
      <h1 style="font-size: 32px; letter-spacing: 5px;">${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });
}