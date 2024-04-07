import express from "express";
import * as comentarioController from "../controllers/comentarioController.js";
import * as userController from "../controllers/userController.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/comentario/crear",
  userController.userIsAuthenticated,
  body("*").trim().escape(),
  comentarioController.crearComentario
);

router.post(
    "/comentario/eliminar/:id",
    userController.userIsAuthenticated,
    comentarioController.eliminarComentario
  );

export default router;
