import Categorias from "../models/Categoria.js";
import Grupo from "../models/Grupo.js";
import multer, { MulterError } from "multer";
import shortid from "shortid";
import { existsSync, mkdirSync, unlink } from "node:fs";

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

  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter(req, file, cb) {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        return cb(null, true);
      }

      const error = new MulterError("FORMAT_INVALID");
      error.field = "file";
      error.message = "Formato inválido, suba imágenes JPG/JPEG o PNG";

      cb(error, false);
    },
  }).single("imagen");

  upload(req, res, function (err) {
    if (err && err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        req.flash("error", "Imagen muy pesada Máx. 2MB");
      }
      if (err.code === "FORMAT_INVALID") {
        req.flash("error", err.message);
      }
      if (req.params.id) {
        return res.redirect(`/edit-group/${req.params.id}`);
      } else {
        return res.redirect("/new-group");
      }
    }

    return next();
  });
};

export const createGroup = async (req, res) => {
  const grupo = {
    name: req.body.name ?? "",
    descripcion: req.body.descripcion ?? "",
    url: req.body.url ?? "",
    imagen: req.file ? req.file.filename : null,
    CategoriaId: req.body.CategoriaId ?? null,
    UserId: req.user.id,
  };

  try {
    await Grupo.create(grupo);
    req.flash("success", "Grupo creado correctamente");
    return res.redirect("/dashboard");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errorsSequelize = error.errors.map((error) => {
        return error.message;
      });
      req.flash("error", errorsSequelize);
    } else {
      req.flash("error", "Ha ocurrido un error intentelo mas tarde");
    }

    return res.redirect("/new-group");
  }
};

export const formEditGroup = async (req, res) => {
  try {
    const grupo = await Grupo.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    //Si no es el dueño del grupo
    if (!grupo) {
      req.flash("error", "Operacion no válida");
      return res.redirect("/dashboard");
    }

    const categorias = await Categorias.findAll();

    res.render("group/edit", {
      pageName: `Editar grupo, ${grupo.name}`,
      messages: req.flash(),
      categorias,
      grupo,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Ha ocurrido un error, intente mas tarde");
    return res.redirect("/dashboard");
  }
};

const deleteImage = (imagen) => {
  if (!imagen) {
    return;
  }
  const path = __dirname + `/../public/uploads/${imagen}`;
  unlink(path, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Se elimino la imagen: ${imagen}`);
  });
};

export const editGroup = async (req, res) => {
  const grupo = await Grupo.findOne({
    where: { id: req.params.id, UserId: req.user.id },
  });

  //Si no es el dueño del grupo
  if (!grupo) {
    req.flash("error", "Operacion no válida");
    return res.redirect("/dashboard");
  }

  const datos = {
    name: req.body.name ?? "",
    descripcion: req.body.descripcion ?? "",
    url: req.body.url ?? "",
    CategoriaId: req.body.CategoriaId ?? null,
  };

  if (req.file) {
    deleteImage(grupo.imagen);
    datos.imagen = req.file.filename;
  } else if (req.body.hasImage === "false") {
    deleteImage(grupo.imagen);
    datos.imagen = null;
  } else {
    datos.imagen = grupo.imagen;
  }

  try {
    await grupo.update(datos);
    req.flash("success", "Grupo modificado correctamente");
    return res.redirect("/dashboard");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errorsSequelize = error.errors.map((error) => {
        return error.message;
      });
      req.flash("error", errorsSequelize);
    } else {
      req.flash("error", "Ha ocurrido un error intentelo mas tarde");
    }
    return res.redirect(`/edit-group/${grupo.id}`);
  }
};

export const deleteGroup = async (req, res) => {
  const { id } = req.body;
  const grupo = await Grupo.findOne({
    where: { id, UserId: req.user.id },
  });

  //Si no es el dueño del grupo
  if (!grupo) {
    return res.status(400).json({ message: "Error de validacion" });
  }

  try {
    deleteImage(grupo.imagen);
    grupo.destroy();
    return res.status(200).json({ message: "Grupo eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error del servidor" });
  }
};
