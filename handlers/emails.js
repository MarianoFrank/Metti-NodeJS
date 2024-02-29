import nodemailer from "nodemailer";
import emailConfig from "../config/emails.js";
import fs from "fs";
import util from "util";
import ejs from "ejs";

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarEmail = (opt) => {
  const templatePath = __dirname + `../views/emails/${opt.template}.ejs`;

  //retorna una funcion que se usa para compliar EJS a HTML
  const compiledTemplate = ejs.compile(fs.readFileSync(templatePath, "utf8"));

  //ejecutamos la funcino de renderizar,esta retornara el HTML, toma como argumentos los datos EJS del archivo
  const html = compiledTemplate({ url: opt.url });

  const mailOptions = {
    from: "Meeti <noreply@meeti.com>",
    to: opt.user.email,
    subject: opt.subject,
    html: html,
  };

  const sendMail = util.promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
