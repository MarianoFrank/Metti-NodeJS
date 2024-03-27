import express from "express";
import { body } from "express-validator";
import * as userController from "../controllers/userController.js";
import * as adminController from "../controllers/adminController.js";
import * as groupController from "../controllers/groupController.js";
import * as imageController from "../controllers/imageController.js";
const router = express.Router();

//Public
router.get("/login", userController.loginForm);
router.post("/login", userController.login);

router.post("/register", userController.register);
router.get("/register", userController.registerForm);

router.get("/confirm-account/:token", userController.confirmAccount);

router.get("/logout", userController.logout);

//Private
router.get(
  "/dashboard",
  userController.userIsAuthenticated,
  adminController.renderDashboard
);

router.get(
  "/edit-profile",
  userController.userIsAuthenticated,
  adminController.formEditProfile
);

router.post(
  "/edit-profile",
  userController.userIsAuthenticated,
  imageController.uploadImage,
  body("*").trim().escape(),
  adminController.editProfile
);
//Grupos
//Create
router.get(
  "/new-group",
  userController.userIsAuthenticated,
  groupController.formNewGroup
);
router.post(
  "/new-group",
  userController.userIsAuthenticated,
  imageController.uploadImage,
  body("*").trim().escape(),
  groupController.createGroup
);
//Edit
router.get(
  "/edit-group/:id",
  userController.userIsAuthenticated,
  groupController.formEditGroup
);
router.post(
  "/edit-group/:id",
  userController.userIsAuthenticated,
  imageController.uploadImage,
  body("*").trim().escape(),
  groupController.editGroup
);
router.get(
  "/change-password/:id",
  userController.userIsAuthenticated,
  adminController.formChangePassword
);
router.post(
  "/change-password/:id",
  userController.userIsAuthenticated,
  adminController.changePassword
);

//Eliminar
router.post(
  "/delete-group",
  userController.userIsAuthenticated,
  body("*").trim().escape(),
  groupController.deleteGroup
); //Api para eliminar

export default router;
