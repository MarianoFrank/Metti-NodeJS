import Grupo from "../models/Grupo.js";
import Meeti from "../models/Meeti.js";

export const formNewMeeti = async (req, res) => {
  const grupos = await Grupo.findAll({ where: { UserId: req.user.id } });
  res.render("meeti/new", {
    pageName: "Crear nuevo Meeti",
    messages: req.flash(),
    grupos,
  });
};

export const createMeeti = async (req, res) => {
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
    await Meeti.create(datos);
    req.flash("success", "Meeti creado correctamente");
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

    return res.redirect("/new-meeti");
  }
};

export const formEditMeeti = async (req, res) => {
  const [grupos, meeti] = await Promise.all([
    Grupo.findAll({ where: { UserId: req.user.id } }),
    Meeti.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    }),
  ]);

  if (!meeti || !grupos) {
    req.flash("error", "Operacion no válida");
    return res.redirect("/dashboard");
  }

  res.render("meeti/edit", {
    pageName: `Editar Meeti: ${meeti.titulo}`,
    messages: req.flash(),
    grupos,
    meeti,
  });
};

export const editMeeti = async (req, res) => {
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
    const meeti = await Meeti.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    await meeti.update(datos);
    req.flash("success", "Meeti guardado correctamente");
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

    return res.redirect("/new-meeti");
  }
};

export const deleteMeeti = async (req, res) => {
  const { id } = req.body;
  const meeti = await Meeti.findOne({
    where: { id, UserId: req.user.id },
  });

  //Si no es el dueño del grupo
  if (!meeti) {
    return res.status(400).json({ message: "Error de validacion" });
  }

  try {
    meeti.destroy();
    return res.status(200).json({ message: "Meeti eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error del servidor" });
  }
};
