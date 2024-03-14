import Categorias from "../models/Categoria.js";
import Grupo from "../models/Grupo.js";
import multer from "multer";
import { existsSync, mkdirSync } from "node:fs";

import __dirname from "../helpers/dirname.js";

export const formNewGroup = async (req, res) => {
  const categorias = await Categorias.findAll();
  res.render("group/new", {
    pageName: "Nuevo grupo",
    messages: req.flash(),
    categorias,
  });
};

const goupsImgPath = __dirname + "/../public/uploads";

if (!existsSync(goupsImgPath)) {
  mkdirSync(goupsImgPath);
}

const uploadGroupImg = multer({ dest: goupsImgPath });

export const createGroup = async (req, res) => {
  console.log(req.body);
  uploadGroupImg.single("imagen");
  return;
  const grupoData = req.body;
  try {
    //grupoData.UserId = req.user.id;
    await Grupo.create(grupoData);

    req.flash("success", "Grupo creado correctamente");
    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error.name);
    if (error.name === "SequelizeValidationError") {
      const errores = error.errors.map((err) => err.message);
      req.flash("error", errores);
    } else {
      req.flash("error", "Ha ocurrido un error intentelo mas tarde");
    }
    return res.redirect("/new-group");
  }
};
