import Grupo from "../models/Grupo.js";
import Meti from "../models/Meti.js";

export const formNewMeti = async (req, res) => {
  const grupos = await Grupo.findAll({ where: { UserId: req.user.id } });
  res.render("meti/new", {
    pageName: "Crear nuevo Meti",
    messages: req.flash(),
    grupos,
  });
};

export const createMeti = async (req, res) => {
  const datos = req.body;

  datos.UserId = req.user.id;

  try {
    //no importa sanitizar las coordenadas, porque si no es json seguro falla
    const chords = JSON.parse(datos.coordenadas);
    const chordsArray = [parseFloat(chords.lat), parseFloat(chords.lng)];
    console.log(chordsArray);
    datos.coordenadas = {
      type: "Point",
      coordinates: chordsArray,
    };
  } catch (error) {
    console.log("No hay coordenadas");
    datos.coordenadas = "";
  }

  try {
    await Meti.create(datos);
    req.flash("success", "Meti creado correctamente");
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

    return res.redirect("/new-meti");
  }
};

export const formEditMeti = async (req, res) => {
  const [grupos, meti] = await Promise.all([
    Grupo.findAll({ where: { UserId: req.user.id } }),
    Meti.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    }),
  ]);

  if (!meti || !grupos) {
    req.flash("error", "Operacion no válida");
    return res.redirect("/dashboard");
  }

  res.render("meti/edit", {
    pageName: `Editar Meti: ${meti.titulo}`,
    messages: req.flash(),
    grupos,
    meti,
  });
};

export const editMeti = async (req, res) => {
  const datos = req.body;

  datos.UserId = req.user.id;

  try {
    //no importa sanitizar las coordenadas, porque si no es json seguro falla
    const chords = JSON.parse(datos.coordenadas);
    const chordsArray = [parseFloat(chords.lat), parseFloat(chords.lng)];
    console.log(chordsArray);
    datos.coordenadas = {
      type: "Point",
      coordinates: chordsArray,
    };
  } catch (error) {
    console.log("No hay coordenadas");
    datos.coordenadas = "";
  }

  try {
    const meti = await Meti.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    await meti.update(datos);
    req.flash("success", "Meti guardado correctamente");
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

    return res.redirect("/new-meti");
  }
};

export const deleteMeti = async (req, res) => {
  const { id } = req.body;
  const meti = await Meti.findOne({
    where: { id, UserId: req.user.id },
  });

  //Si no es el dueño del grupo
  if (!meti) {
    return res.status(400).json({ message: "Error de validacion" });
  }

  try {
    meti.destroy();
    return res.status(200).json({ message: "Meti eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error del servidor" });
  }
};
