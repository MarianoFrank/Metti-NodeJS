//models
import Categoria from "../models/Categoria.js";
//seeds - datos
import categorias from "./categorias.js";

import db from "../config/db.js";

const importarDatos = async () => {
  try {
    await db.sync();

    await Promise.all([Categoria.bulkCreate(categorias)]);

    console.log("Datos importados correctamente");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const eliminarDatos = async () => {
  try {
    await Categoria.drop();
    console.log("Tabla Usuario eliminada correctamente");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-d") {
  eliminarDatos();
}