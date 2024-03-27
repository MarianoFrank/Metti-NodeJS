import { BelongsTo, DataTypes, Model, UUIDV4 } from "sequelize";
import db from "../config/db.js";
import shortid from "shortid";
import slug from "slug";

import User from "./User.js";
import Grupo from "./Grupo.js";

class Meti extends Model {}

Meti.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    titulo: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Titulo no puede ir vacio" },
      },
    },
    invitado: DataTypes.STRING,
    cupo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Descripcion no puede ir vacio" },
      },
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Asigne una fecha" },
      },
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Asigne una hora" },
      },
    },
    coordenadas: {
      //esto determina puntos en un espacio, en este caso sera bidimensional debido a las coordenadas
      //gracias a esto podemos realizar operaciones especiales
      type: DataTypes.GEOGRAPHY("point", 4326), //4326 es el código EPSG para coordenadas latitud/longitud
      allowNull: false,
      validate: {
        notEmpty: { msg: "Agregue una direccion" },
      },
    },
    interesados:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    slug: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: "Meti",
    tableName: "metis",
    hooks: {
      beforeCreate: (meti) => {
        const url = slug(meti.titulo).toLowerCase();
        meti.slug = `${url}-${shortid.generate()}`;
      },
    },
  }
);

//relaciones

Meti.belongsTo(User, { foreignKey: "UserId", allowNull: false });

Meti.belongsTo(Grupo, {
  foreignKey: "GrupoId",
  allowNull: false,
  validate: { notEmpty: { msg: "Seleccione un grupo" } },
});

export default Meti;
