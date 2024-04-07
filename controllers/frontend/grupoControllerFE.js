import Grupo from "../../models/Grupo.js";
import Meeti from "../../models/Meeti.js";
import { Op } from "sequelize";
import moment from "moment";
import he from "he";

export const mostrarGrupo = async (req, res) => {
  const fechaHoy = moment().format("YYYY-MM-DD");
  const grupo = await Grupo.findByPk(req.params.id, {
    attributes: ["name", "imagen", "descripcion", "url"],
    include: [
      {
        model: Meeti,
        required: false,
        attributes: ["titulo","slug","fecha","hora"],
        where: {
          fecha: {
            [Op.gte]: fechaHoy,
          },
        },
        limit: 3,
        order: [["fecha", "ASC"]],
      },
    ],
  });

  if (!grupo) {
    return res.redirect("/");
  }

  console.log(JSON.stringify(grupo, null, 2));
  grupo.descripcion = he.decode(grupo.descripcion);
  grupo.url = he.decode(grupo.url);
  res.render("group/mostrar", {
    pageName: `Grupo: ${grupo.name}`,
    messages: req.flash(),
    grupo,
    moment,
  });
};
