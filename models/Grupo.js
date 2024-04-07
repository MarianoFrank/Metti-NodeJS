import { DataTypes, Model, UUIDV4 } from "sequelize";
import db from "../config/db.js";
import Categoria from "./Categoria.js";
import User from "./User.js";

class Grupo extends Model {}

Grupo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nombre no puede ir vacio" },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Coloca una descripcion" },
      },
    },
    url: DataTypes.TEXT,
    imagen: DataTypes.TEXT,
  },
  {
    sequelize: db,
    modelName: "Grupo",
    tableName: "grupos",
  }
);

Grupo.belongsTo(Categoria, { foreignKey: "CategoriaId", allowNull: true });
Grupo.belongsTo(User);
User.hasMany(Grupo);
export default Grupo;
