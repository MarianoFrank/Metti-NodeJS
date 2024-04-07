import { DataTypes, Model, UUIDV4 } from "sequelize";
import db from "../config/db.js";
import Meeti from "./Meeti.js";
import User from "./User.js";

class Comentario extends Model {}

Comentario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Comentario vacio" },
      },
    },
  },
  {
    sequelize: db,
    modelName: "Comentario",
    tableName: "comentarios",
  }
);

//El comentario pertenece a un meeti y un metti tiene muchos comentarios
Comentario.belongsTo(Meeti); //1:1
Meeti.hasMany(Comentario); //1:n

//el comentario lo hace un usuario y un usuario crea muchos comentarios
Comentario.belongsTo(User);
User.hasMany(Comentario);

export default Comentario;
