import Categorias from "../models/Categoria.js";
import Grupo from "../models/Grupo.js";
import multer from "multer";
import shortid from "shortid";
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

//sube la imagen al servidor
export const uploadImage = (req, res, next) => {
  const uploadPath = __dirname + "/../public/uploads";

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath);
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}-${Date.now()}.${extension}`);
    },
  });

  const upload = multer({ storage }).single("imagen");

  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    return next();
  });
};

export const createGroup = async (req, res) => {
  const grupo = {
    name: req.body.name,
    descripcion: req.body.descripcion,
    url: req.body.url,
    imagen: req.file ? req.file.filename : null,
    CategoriaId: req.body.CategoriaId ?? null,
    UserId: req.user.id ?? null,
  };
  console.log(grupo);
  try {
    await Grupo.create(grupo);

    req.flash("success", "Grupo creado correctamente");

    return res.redirect("/dashboard");

  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeValidationError") {
      const errores = error.errors.map((err) => err.message);
      req.flash("error", errores);
    } else {
      req.flash("error", "Ha ocurrido un error intentelo mas tarde");
    }
    return res.redirect("/new-group");
  }
};
