import Grupo from "../models/Grupo.js";

export const formNewMeeti = async (req, res) => {
  const grupos = await Grupo.findAll({ where: { UserId: req.user.id } });
  res.render("meeti/new", {
    pageName: "Crear nuevo Meeti",
    messages: req.flash(),
    grupos
  });
};
