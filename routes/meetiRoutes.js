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
// router.post(
//   "/new-meeti",
//   userController.userIsAuthenticated,
//   groupController.uploadImage,
//   body("*").trim().escape(),
//   groupController.createGroup
// );
// //Edit
// router.get(
//   "/edit-meeti/:id",
//   userController.userIsAuthenticated,
//   groupController.formEditGroup
// );
// router.post(
//   "/edit-meeti/:id",
//   userController.userIsAuthenticated,
//   groupController.uploadImage,
//   body("*").trim().escape(),
//   groupController.editGroup
// );
// //Eliminar
// router.post(
//   "/delete-meeti",
//   userController.userIsAuthenticated,
//   body("*").trim().escape(),
//   groupController.deleteGroup
// ); //Api para eliminar

export default router;
