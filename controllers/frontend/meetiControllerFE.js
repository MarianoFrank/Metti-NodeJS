import Meeti from "../../models/Meeti.js";
import Grupo from "../../models/Grupo.js";
import User from "../../models/User.js";
import he from "he";
import moment from "moment";
import Categoria from "../../models/Categoria.js";
import Comentario from "../../models/Comentario.js";
import { Sequelize, Op, GEOMETRY } from "sequelize";
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
      "Asistencia", //trae todos los asistentes
      {
        model: Comentario,
        required: false,
        include: [
          {
            model: User,
            attributes: ["name", "image", "id"],
          },
        ],
      },
    ],
  });

  if (!meeti) {
    return res.redirect("/");
  }
  console.log(JSON.stringify(meeti, null, 2));

  //desescape a html de descripcion
  meeti.descripcion = he.decode(meeti.descripcion);

  //buscamos meetis sercanos
  const centro = meeti.coordenadas.coordinates;
  //esta funcion retorna distancia mas cercana en metros
  const distanciaFn = Sequelize.fn(
    "ST_DistanceSphere",
    Sequelize.literal(`coordenadas::geometry`), //columna coordenadas convertida a geometria
    Sequelize.literal(`ST_GeomFromText('POINT(${centro[0]} ${centro[1]})')`) //convierte las coordenadas del meeti acual en una geometria
  );

  const meetis = await Meeti.findAll({
    attributes: ["titulo", "fecha", "hora","slug"],
    order: [[distanciaFn, "ASC"]],
    where: Sequelize.where(distanciaFn, {
      [Op.lte]: 20000, //20kms
    }),
    where: {
      slug: {
        [Op.ne]: req.params.slug,
      },
    },
    limit: 3,
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

  // console.log("Mettis Serca:");
  // console.log(JSON.stringify(meetis, null, 2));

  /*Otra Manera:
//pero de esta manera no se puede ordenar
//esta funcion retorna true si estan a una distancia
  const distanciaFn = Sequelize.fn(
    "ST_DWithin",
    Sequelize.col("coordenadas"), //distancia tomada de cada columna iterada
    meeti.coordenadas.coordinates, //centro
    10000 //radio de 10kms
  );

   const meetis = await Meeti.findAll({
     attributes: ["titulo"],
     where: Sequelize.where(distanciaFn, true),
     where: {
       slug: {
         [Op.ne]: req.params.slug,
       },
     },
     limit: 3,
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
*/

  res.render("meeti/mostrar", {
    pageName: meeti.titulo,
    messages: req.flash(),
    meeti,
    user: req.user,
    moment,
    meetis,
  });
};

export const confirmarAsistencia = async (req, res) => {
  try {
    const meeti = await Meeti.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          association: "Asistencia",
          where: {
            id: req.user.id,
          },
          required: false, //no es obligatorio que esté
          attributes: ["id"],
        },
      ],
    });
    //otra de obtener el asistente si ya se registró forma seria...
    //const asistente = await meeti.getAsistencia();

    console.log(JSON.stringify(meeti, null, 2));

    if (!meeti) {
      return res.status(404).json({
        msg: "Ha ocurrido un error intente mas tarde",
      });
    }

    if (meeti.Asistencia.length > 0) {
      meeti.removeAsistencia(req.user.id);
      return res.status(200).json({
        msg: "Asistencia borrada",
        asiste: false,
      });
    }

    meeti.addAsistencia(req.user.id); //agrega un registro a la tabla asistents_metti
    return res.status(200).json({
      msg: "Asistencia cargada",
      asiste: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      msg: "Ha ocurrido un error intente mas tarde",
    });
  }
};

export const asiste = async (req, res) => {
  try {
    const meeti = await Meeti.findOne({
      where: { slug: req.params.slug },
    });

    const asistencia = await meeti.getAsistencia({
      where: {
        id: req.user.id,
      },
      attributes: [],
    });
    console.log(JSON.stringify(asistencia, null, 2));

    //Otra manera
    // const asistencia = await User.findOne({
    //   where: { id: req.user.id },
    //   include: [
    //     {
    //       association: "Asistencia",
    //       where: {
    //         slug: req.params.slug,
    //       },
    //       required: true,
    //       attributes:[],
    //     },
    //   ],
    // });

    if (!meeti) {
      return res.status(404).json({
        msg: "Ha ocurrido un error intente mas tarde",
      });
    }

    if (asistencia.length > 0) {
      return res.status(200).json({
        asiste: true,
      });
    }
    return res.status(200).json({
      asiste: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      msg: "Ha ocurrido un error intente mas tarde",
    });
  }
};

export const mostrarAsistentes = async (req, res) => {
  const meeti = await Meeti.findOne({
    where: { slug: req.params.slug },
    attributes: ["id", "titulo"],
  });
  if (!meeti) {
    return res.redirect("/");
  }
  const asistentes = await meeti.getAsistencia({
    attributes: ["image", "name"],
    joinTableAttributes: [], //no traigo atributos de la tabla intermedia
  });

  res.render("meeti/asistentes", {
    pageName: `Asistentes de ${meeti.titulo}`,
    messages: req.flash(),
    asistentes,
  });
};

export const mostrarMeetiPorCategoria = async (req, res) => {
  const fechaHoy = moment().format("YYYY-MM-DD");
  //Traera los meetis que aun no han pasado y cuyo grupo asociado tenga cierta categoria
  const meetis = await Meeti.findAll({
    attributes: ["titulo", "id", "fecha", "hora", "slug"],
    where: {
      fecha: { [Op.gte]: fechaHoy },
    },
    order: [["fecha", "ASC"]],
    include: [
      {
        model: Grupo,
        attributes: ["imagen"],
        required: true,
        include: [
          {
            model: Categoria,
            where: {
              name: req.params.categoria,
            },
            required: true,
            attributes: [],
          },
        ],
      },
      {
        model: User,
        attributes: ["name", "image"],
      },
    ],
  });

  res.render("categoria", {
    pageName: `Categoria: ${req.params.categoria}`,
    messages: req.flash(),
    meetis,
    moment,
  });
  console.log(JSON.stringify(meetis, null, 2));
};

export const meetisCercanos = async (req, res) => {};
