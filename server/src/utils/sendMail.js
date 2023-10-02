const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = asyncHandler(async ({ email, html }) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: "Interview Smart System",
    to: email,
    subject: "Forgot password",
    html: html,
  });

  return info;
});

module.exports = { sendMail };
