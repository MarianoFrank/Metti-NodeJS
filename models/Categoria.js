import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";


class Categoria extends Model {}

Categoria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.TEXT,
  },
  {
    sequelize: db,
    modelName: "Categoria",
    tableName: "categorias",
  }
);

export default Categoria;
