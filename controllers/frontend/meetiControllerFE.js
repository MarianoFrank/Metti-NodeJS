import Meeti from "../../models/Meeti.js";
import Grupo from "../../models/Grupo.js";
import User from "../../models/User.js";
import he from "he";
import moment from "moment";

export const mostrarMeeti = async (req, res) => {
  const meeti = await Meeti.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [
      {
        model: Grupo,
        attributes: ["imagen", "name"],
      },
      {
        model: User,
        attributes: ["id", "name", "image"],
      },
      "Asistentes", //trae todos los asistentes
    ],
  });

  console.log(JSON.stringify(meeti, null, 2));
  if (!meeti) {
    return res.redirect("/");
  }

  //desescape a html de descripcion
  meeti.descripcion = he.decode(meeti.descripcion);

  res.render("meeti/mostrar", {
    pageName: meeti.titulo,
    messages: req.flash(),
    meeti,
    user: req.user,
    moment,
  });
};
