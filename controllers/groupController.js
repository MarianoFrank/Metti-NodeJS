import Categorias from "../models/Categoria.js";
import Grupo from "../models/Grupo.js";
import * as imageController from "./imageController.js";


export const formNewGroup = async (req, res) => {
  const categorias = await Categorias.findAll();
  res.render("group/new", {
    pageName: "Nuevo grupo",
    messages: req.flash(),
    categorias,
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
    imageController.deleteImage(grupo.imagen);
    datos.imagen = req.file.filename;
  } else if (req.body.hasImage === "false") {
    imageController.deleteImage(grupo.imagen);
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
