import express from "express";
import { body } from "express-validator";

import * as userController from "../controllers/userController.js";
import * as meetiController from "../controllers/meetiController.js";

import * as meetiControllerFE from "../controllers/frontend/meetiControllerFE.js";
import * as grupoControllerFE from "../controllers/frontend/grupoControllerFE.js";

const router = express.Router();
//Grupos
//Create
router.get(
  "/new-meeti",
  userController.userIsAuthenticated,
  meetiController.formNewMeeti
);
router.post(
  "/new-meeti",
  userController.userIsAuthenticated,
  body("*").trim().escape(),
  body("coordenadas").unescape(),
  meetiController.createMeeti
);
//Edit
router.get(
  "/edit-meeti/:id",
  userController.userIsAuthenticated,
  meetiController.formEditMeeti
);

router.post(
  "/edit-meeti/:id",
  userController.userIsAuthenticated,
  body("*").trim().escape(),
  body("coordenadas").unescape(),
  meetiController.editMeeti
);
//Eliminar
router.post(
  "/delete-meeti",
  userController.userIsAuthenticated,
  body("*").trim().escape(),
  meetiController.deleteMeeti
); //Api para eliminar

//muestra los grupos
router.get("/grupo/:id",grupoControllerFE.mostrarGrupo)



//Frontend de un meeti
router.get("/meeti/:slug",meetiControllerFE.mostrarMeeti);

//Confrima asistencia a meeti
router.post("/confirmar-asitencia/:slug",meetiControllerFE.confirmarAsistencia);

//retorna si el usuario asiste o no
router.post("/asiste/:slug",meetiControllerFE.asiste);

//muestra todos los asistentes del meeti
router.get("/asistentes/:slug",meetiControllerFE.mostrarAsistentes);


router.get("/meetis/sercanos",meetiControllerFE.meetisCercanos)

export default router;