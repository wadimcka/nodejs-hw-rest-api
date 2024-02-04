require("dotenv").config();
const nodemailer = require("nodemailer");

const { META_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "jonka1955@meta.ua",
    pass: META_PASSWORD,
  },
});

async function sendEmail(data) {
  const newEmail = { ...data, from: "jonka1955@meta.ua" };
  await transport
    .sendMail(newEmail)
    .then(() => console.log("success"))
    .catch((error) => console.log("ERROR:", error.message));
  return true;
}

module.exports = sendEmail;

// const { MAIL_TRAP_USER, MAIL_TRAP_PAS } = process.env;

// const transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: MAIL_TRAP_USER,
//     pass: MAIL_TRAP_PAS,
//   },
// });
