import Grupo from "../models/Grupo.js";
import Meeti from "../models/Meeti.js";
import { Op } from "sequelize";
import moment from "moment";
import User from "../models/User.js";
import * as imageController from "./imageController.js";

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
    //metis ya pasados
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
