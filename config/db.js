import { Sequelize } from "sequelize";
import "dotenv/config";
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false, //desactivamos mensajes
  }
);

db.sync()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((err) => {
    console.log(err);
  });

db.query("CREATE EXTENSION IF NOT EXISTS postgis;")
  .then(() => {
    console.log("Extensión postgis creada correctamente");
  })
  .catch((error) => {
    console.error("Error al crear la extensión postgis:", error);
  });

export default db;
