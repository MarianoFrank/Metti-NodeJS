import { query } from "express-validator";
import { Sequelize, Op } from "sequelize";
import Meeti from "../../models/Meeti.js";
import Grupo from "../../models/Grupo.js";
import User from "../../models/User.js";
import moment from "moment";

export const mostrarBusqueda = async (req, res) => {
  const centro = JSON.parse(req.query.coordenadas).reverse();
  //esta funcion retorna distancia mas cercana en metros
  const distanciaFn = Sequelize.fn(
    "ST_DistanceSphere",
    Sequelize.literal(`coordenadas::geometry`), //columna coordenadas convertida a geometria
    Sequelize.literal(`ST_GeomFromText('POINT(${centro[0]} ${centro[1]})')`) //convierte las coordenadas del meeti acual en una geometria
  );

  const meetis = await Meeti.findAll({
    attributes: ["titulo", "fecha", "hora", "slug","coordenadas"],
    order: [[distanciaFn, "ASC"]],
    where: Sequelize.where(distanciaFn, {
      [Op.lte]: JSON.parse(req.query.radio) * 1000, //radio en kms
    }),
    include: [
      {
        model: Grupo,
        attributes: ["imagen", "name"],
      },
      {
        model: User,
        attributes: ["image", "name"],
      },
    ],
  });
console.log(JSON.stringify(meetis,null,2));

  res.render("busqueda", {
    pageName: "Resultado busqueda...",
    messages: req.flash(),
    meetis,
    moment,
  });
};
