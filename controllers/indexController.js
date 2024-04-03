import { Op } from "sequelize";
import Categoria from "../models/Categoria.js";
import Meeti from "../models/Meeti.js";
import moment from "moment";
import User from "../models/User.js";
import Grupo from "../models/Grupo.js";
export const home = async (req, res) => {
  const [categorias, meetis] = await Promise.all([
    Categoria.findAll(),
    Meeti.findAll({
      where: {
        fecha: {
          [Op.gte]: moment(Date.now()).format("YYYY-MM-DD"),
        },
      },
      limit: 3,
      attributes: ["slug", "titulo", "fecha", "hora"],
      order: [["fecha", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["name","image"],
        },
        {
          model: Grupo,
          attributes: ["imagen"],
        },
      ],
    }),
  ]);
  console.log(JSON.stringify(meetis));
  res.render("home", {
    pageName: "Inicio",
    messages: req.flash(),
    categorias,
    meetis,
    moment
  });
};
