const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password, không phải mật khẩu Gmail thường
    },
  })

  await transporter.sendMail({
    from: `"Hùng Hà Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  })
}

module.exports = sendEmail