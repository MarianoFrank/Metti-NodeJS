import { body, validationResult } from "express-validator";
import User from "../models/userModel.js";
import { enviarEmail } from "../handlers/emails.js";
import { generateJWT, verifyJWT } from "../helpers/tokens.js";
import passport from "../config/passport.js";

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
  try {
    const body = req.body;

    const newUser = User.build(body);

    const erroresCampos = await validarCamposRegistro(newUser, req);

    const erroresDatos = await existeUsuario(newUser);

    const errores = [...erroresCampos, ...erroresDatos];

    if (errores.length > 0) {
      console.log(errores);
      req.flash("error", errores);
      return registerForm(req, res);
    }

    const token = generateJWT(newUser.email);

    newUser.token = token;
    newUser.tokenExpire = new Date(Date.now() + 3600 * 1000); //1 hora

    await newUser.save();

    //Enviar Email con token
    await enviarEmail({
      user: newUser,
      url: `http://${req.headers.host}/confirm-account/${token}`,
      subject: "Confirma tu cuenta de Metti",
      template: "confirm-account",
    });

    req.flash(
      "success",
      "Verifique su bandeja de entrada para validar registro"
    );
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    req.flash("error", "Ha ocurrido un error intentelo mas tarde");
  }
  return registerForm(req, res);
};

const existeUsuario = async (newUser) => {
  let errores = [];

  let user = await User.findOne({ where: { email: newUser.email } });

  if (user && user.active === true) {
    errores.push("Email ya registrado");
  }

  user = null;

  user = await User.findOne({ where: { name: newUser.name } });

  if (user) {
    errores.push("Nombre de usuario ya registrado, intente otro");
  }

  return errores;
};

const validarCamposRegistro = async (user, req) => {
  //Express
  const rules = [
    body("passwordRepeat")
      .equals(user.password)
      .withMessage("Los passwords no son iguales"),
  ];
  await Promise.all(rules.map((validation) => validation.run(req)));
  const result = validationResult(req);
  const errores = result.errors.map((error) => error.msg);

  //Sequelize
  await user.validate().catch((error) => {
    error.errors.forEach((error) => {
      errores.push(error.message);
    });
  });

  return errores;
};

export const confirmAccount = async (req, res) => {
  const token = req.params.token;
  try {
    const { email } = verifyJWT(token);

    const user = await User.findOne({ where: { email, token } });

    if (user) {
      user.active = true;
      user.token = null;
      user.tokenExpire = null;

      await user.save();

      req.flash(
        "success",
        "Cuenta verifiacada correctamente, ya puedes iniciar sesion"
      );
    } else {
      req.flash("error", "Token expirado o inexistente");
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Ha ocurrido un error intentelo mas tarde");
  }

  return res.redirect("/login");
};

export const login = (req, res) => {
  passport.authenticate("local", (err, user, info, status) => {
    if (err) {
      console.error(err);
      req.flash("error", "Ocurrió un error, inténtelo más tarde");
      return res.redirect("/login");
    }
  
    if (user) {
      if (user.active === false) {
        req.flash("error", "Debe validar su cuenta");
        return res.redirect("/login");
      }
  
      return req.logIn(user, (err) => {
        if (err) {
          console.error(err);
          req.flash("error", "Ocurrió un error, inténtelo más tarde");
          return res.redirect("/login");
        }
        return res.redirect("/dashboard");
      });
    }
  
    if (status === 400) {
      req.flash("error", "Ambos campos son requeridos");
    } else if (info) {
      req.flash("error", info.message);
    } 
    return res.redirect("/login");
  })(req, res);
  
};



export const userIsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("error", "Debes iniciar sesion");

  return res.redirect("/login");
};
