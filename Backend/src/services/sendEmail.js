// // utils/sendEmail.js
// const nodemailer = require('nodemailer');

// async function sendEmail({ to, subject, html }) {
//   // Use env variables for SMTP config
//   const transporter = nodemailer.createTransport({
//   host: "gmail",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
  

// });
// transporter.verify(function(error, success) {
//     if (error) {
//         console.log("Email server error:", error);
//     } else {
//         console.log("Email server connected successfully");
//     }
// });



//   await transporter.sendMail({
//     from: `"ChatGpt Clone" <${process.env.EMAIL_USER}>`,
//     to:email,
//     subject:"Reset Password Link",
//     html:`<p>Click here: <a href="${resetUrl}">Reset Password</a></p>`
//   });
// }

// module.exports = sendEmail;



// services/sendEmail.js - Fixed version
const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, html }) {
  try {
    // Gmail configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Changed from "gmail" string to service: 'gmail'
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("✅ Email server connected successfully");

    // Send email
    const info = await transporter.sendMail({
      from: `"ChatGPT Clone" <${process.env.EMAIL_USER}>`,
      to: to, // Fixed: was using undefined 'email' variable
      subject: subject, // Fixed: was hardcoded
      html: html // Fixed: was using undefined variables
    });

    console.log("✅ Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
}

module.exports = sendEmail;
