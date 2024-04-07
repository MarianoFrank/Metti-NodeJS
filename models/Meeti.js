import { BelongsTo, DataTypes, Model, UUIDV4 } from "sequelize";
import db from "../config/db.js";
import shortid from "shortid";
import slug from "slug";

import User from "./User.js";
import Grupo from "./Grupo.js";

class Meeti extends Model {}

Meeti.init(
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
      type: DataTypes.GEOMETRY("point"),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Agregue una direccion" },
      },
    },
    slug: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: "Meeti",
    tableName: "meetis",
    hooks: {
      beforeCreate: (meeti) => {
        const url = slug(meeti.titulo).toLowerCase();
        meeti.slug = `${url}-${shortid.generate()}`;
      },
    },
  }
);

export default Meeti;

//relaciones

Meeti.belongsTo(User, { foreignKey: "UserId", allowNull: false });

//Defino la relacion en ambos sentidos
Meeti.belongsToMany(User, {
  through: "asistentes_meetis",
  tableName: "asistentes_meetis",
  as: "Asistencia",
  timestamps: false,
});

User.belongsToMany(Meeti, {
  through: "asistentes_meetis",
  tableName: "asistentes_meetis",
  as: "Asistencia",
  timestamps: false,
});

Meeti.belongsTo(Grupo, {
  foreignKey: "GrupoId",
  allowNull: false,
  validate: { notEmpty: { msg: "Seleccione un grupo" } },
});

Grupo.hasMany(Meeti);
