require("dotenv").config();
const nodemailer = require("nodemailer");

const { META_USER, META_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_USER,
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
