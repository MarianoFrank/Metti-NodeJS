import nodemailer from "nodemailer";
import fs from "fs";
import util from "util";
import ejs from "ejs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarEmail = (opt) => {
  const templatePath = path.join(
    __dirname + `/../views/emails/${opt.template}.ejs`
  );

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

  return transport.sendMail(mailOptions);
};
