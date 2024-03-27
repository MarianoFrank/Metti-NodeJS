import { Op, where } from "sequelize";
import Categoria from "../models/Categoria.js";
import Meti from "../models/Meti.js";
import moment from "moment";
import User from "../models/User.js";
import Grupo from "../models/Grupo.js";
export const home = async (req, res) => {
  const [categorias, metis] = await Promise.all([
    Categoria.findAll(),
    Meti.findAll({
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
          attributes: ["name"],
        },
        {
          model: Grupo,
          attributes: ["imagen"],
        },
      ],
    }),
  ]);
  console.log(metis);
  res.render("home", {
    pageName: "Inicio",
    messages: req.flash(),
    categorias,
    metis,
  });
};
