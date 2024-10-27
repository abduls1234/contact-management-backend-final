const db = require('../../../database/db');
const nodemailer = require('nodemailer');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit code
    db.run("UPDATE users SET emailVerificationCode = ? WHERE email = ?", [verificationCode, email], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Send email with verification code
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // Replace with your email provider
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-email-password'
        }
      });
      transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Your verification code is ${verificationCode}`
      });

      res.status(200).json({ message: 'Verification code sent' });
    });
  } else {
    res.status(405).end();
  }
};
