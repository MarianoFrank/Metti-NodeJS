import Grupo from "../../models/Grupo.js";
import User from "../../models/User.js";
import he from "he";
export const mostrarUser = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ["name", "image", "descripcion"],
    include: [
      {
        model: Grupo,
        required: false,
        attributes: ["name", "imagen","id"],
      },
    ],
  });
  console.log(JSON.stringify(user, null, 2));

  if (!user) {
    return res.redirect("/");
  }
  user.descripcion = he.decode(user.descripcion);
  res.render("mostrar-user", {
    pageName: `Infromacion de ${user.name}`,
    messages: req.flash(),
    user,
  });
};
