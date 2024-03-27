import express from "express";
import { body } from "express-validator";

import * as userController from "../controllers/userController.js";
import * as metiController from "../controllers/metiController.js";

const router = express.Router();
//Grupos
//Create
router.get(
  "/new-meti",
  userController.userIsAuthenticated,
  metiController.formNewMeti
);
router.post(
  "/new-meti",
  userController.userIsAuthenticated,
  body("*").trim().escape(),
  body("coordenadas").unescape(),
  metiController.createMeti
);
//Edit
router.get(
  "/edit-meti/:id",
  userController.userIsAuthenticated,
  metiController.formEditMeti
);

router.post(
  "/edit-meti/:id",
  userController.userIsAuthenticated,
  body("*").trim().escape(),
  body("coordenadas").unescape(),
  metiController.editMeti
);
//Eliminar
router.post(
  "/delete-meti",
  userController.userIsAuthenticated,
  body("*").trim().escape(),
  metiController.deleteMeti
); //Api para eliminar

export default router;
