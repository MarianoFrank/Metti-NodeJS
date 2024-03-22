import express from "express";
import { body } from "express-validator";

import * as userController from "../controllers/userController.js";
import * as meetiController from "../controllers/meetiController.js";

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

export default router;
