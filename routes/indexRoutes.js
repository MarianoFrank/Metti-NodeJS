import express from "express";
import * as indexController from "../controllers/indexController.js";
import * as meetiControllerFE from "../controllers/frontend/meetiControllerFE.js";
import * as busquedaControllerFE from "../controllers/frontend/busquedaControllerFE.js";


const router = express.Router();

router.get("/", indexController.home);

//muestra meetis por categoria
router.get("/categoria/:categoria",meetiControllerFE.mostrarMeetiPorCategoria);


router.get("/busqueda", busquedaControllerFE.mostrarBusqueda)
export default router;
