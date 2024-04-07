import Comentario from "../models/Comentario.js";
import Meeti from "../models/Meeti.js";
import User from "../models/User.js";
export const crearComentario = async (req, res) => {
  try {
    const datos = req.body;
    datos.UserId = req.user.id;
    await Comentario.create(req.body);
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
  }

  if (req.body.slug) {
    return res.redirect(`/meeti/${req.body.slug}`);
  }
  return res.redirect("/");
};

export const eliminarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id, {
      include: [
        {
          model: Meeti,
          attributes: ["id", "slug"],
          include: [
            {
              model: User, //Usuario creador del meeti
              attributes: ["id"],
            },
          ],
        },
      ],
    });
    console.log(JSON.stringify(comentario, null, 2));

    //Validamos si lo quiere borrar el creador del comentario o el admin del meeti
    if (
      !(
        comentario.UserId === req.user.id ||
        comentario.Meeti.User.id === req.user.id
      )
    ) {
      return res.status(404).json({ message: "ocurrio un error" });
    }

    await comentario.destroy();

    return res.status(200).json({ message: "Se elimino el comentario" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "ocurrio un error" });
  }
};
