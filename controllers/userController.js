import { body, validationResult } from "express-validator";
import User from "../models/userModel.js";
import { enviarEmail } from "../handlers/emails.js";

export const loginForm = (req, res) => {
  res.render("login", {
    pageName: "Inicia sesión",
    messages: req.flash(),
  });
};

export const registerForm = (req, res) => {
  res.render("register", {
    pageName: "Crea tu cuenta",
    messages: req.flash(),
    formData: req.body ?? "",
  });
};

export const register = async (req, res) => {
  const rules = [
    body("passwordRepeat")
      .equals(req.body.password)
      .withMessage("Los passwords no son iguales"),
  ];
  await Promise.all(rules.map((validation) => validation.run(req)));
  const result = validationResult(req);
  const errorsExpress = result.errors.map((error) => error.msg);

  let errorsSequelize = [];
  try {
    const newUser = User.build(req.body);
    await newUser.validate();
    if (errorsExpress.length === 0) {
      await newUser.save();

      const url = `http://${req.header.host}/confirm-account/token`

      //Enviar Email
      await enviarEmail({
        user: newUser,
        url,
        subject: "Confirma tu cuenta de Metti",
        template: "confirm-account"
      });

      req.flash(
        "success",
        "Verifique su bandeja de entrada para validar registro"
      );
      return res.redirect("/login");
    }
  } catch (error) {
    errorsSequelize = error.errors.map((error) => error.message);
  }

  const allErrors = [...errorsExpress, ...errorsSequelize];
  req.flash("error", allErrors);

  return registerForm(req, res);
};
