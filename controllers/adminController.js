import Grupo from "../models/Grupo.js";
import Meeti from "../models/Meeti.js";
import { Op } from "sequelize";
import moment from "moment";
import User from "../models/User.js";
import * as imageController from "./imageController.js";
import { body, validationResult } from "express-validator";

moment.locale("es");

export const renderDashboard = async (req, res) => {
  const fechaHoy = moment().format("YYYY-MM-DD");

  const [grupos, meetis, oldMeetis] = await Promise.all([
    Grupo.findAll({ where: { UserId: req.user.id } }),
    //meetis fecha mayor o igual a "hoy"
    Meeti.findAll({
      where: {
        UserId: req.user.id,
        fecha: { [Op.gte]: fechaHoy },
      },
      order: [["fecha", "ASC"]],
    }),
    //meetis ya pasados
    Meeti.findAll({
      where: {
        UserId: req.user.id,
        fecha: { [Op.lt]: fechaHoy },
      },
      order: [["fecha", "DESC"]],
    }),
  ]);

  res.render("admin/dashboard", {
    pageName: "dashboard",
    messages: req.flash(),
    grupos,
    meetis,
    oldMeetis,
    moment, //funcion moment
  });
};

export const formEditProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.render("admin/edit-profile", {
    pageName: "Editar perfil",
    messages: req.flash(),
    user,
  });
};

export const editProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  const datos = req.body;

  if (req.file) {
    imageController.deleteImage(user.image);
    datos.image = req.file.filename;
  } else {
    datos.imagen = user.image;
  }

  try {
    await user.update(datos);
    req.flash("success", "Perfil actualizado");
    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeValidationError") {
      const errorsSequelize = error.errors.map((error) => {
        return error.message;
      });
      req.flash("error", errorsSequelize);
    } else {
      req.flash("error", "Ha ocurrido un error intentelo mas tarde");
    }
    return res.redirect("/edit-prodile");
  }
};

export const formChangePassword = (req, res) => {
  res.render("admin/change-password", {
    pageName: "Cambia tu password",
    messages: req.flash(),
  });
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user.validatePassword(req.body.actual)) {
      req.flash("error", "Contraseña incorrecta");
      return res.redirect("/dashboard");
    }

    await body("nuevo")
      .equals(req.body.repite)
      .withMessage("Los passwords no son iguales")
      .run(req);

    const result = validationResult(req);
    const errores = result.errors.map((error) => error.msg);

    if (errores.length > 0) {
      req.flash("error", errores);
      return res.redirect(`/change-password/${user.id}`);
    }

    req.logout(async function (err) {
      if (err) {
        console.log(err);
        req.flash("error", "Lo siento ha ocurrido un error, intente mas tarde");
        return res.redirect("/dashboard");
      }

      //En este punto los password son ingules y la clave actual es correcta, entonces reemplazamos

      const newPassHashed = user.hashPasswordManualy(req.body.nuevo);

      await user.update({
        password: newPassHashed,
      });

      req.flash("success", "Se cambio la contraseña, inicie sesion nuevamente");
      return res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Ha ocurrido un error intentelo mas tarde");
    return res.redirect("/dashboard");
  }
};
