import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

class User extends Model {
  validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  hashPasswordManualy(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nombre no puede ir vacio" },
      },
    },
    image: DataTypes.STRING(60),
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isEmail: { msg: "Agrega email válido" },
      },
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password no puede ir vacio" },
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    descripcion:{
      type: DataTypes.TEXT,
    },
    token: DataTypes.TEXT,
    tokenExpire: DataTypes.DATE,
  },
  {
    sequelize: db,
    modelName: "User",
    tableName: "users",
    hooks: {
      beforeCreate: (user) => {
        user.password = user.hashPasswordManualy(user.password);
      },
    },
  }
);

export default User;
