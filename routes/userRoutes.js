import express from "express";
import * as userController from "../controllers/userController.js";
import * as adminController from "../controllers/adminController.js";
import * as groupController from "../controllers/groupController.js";

const router = express.Router();

//Public
router.get("/login", userController.loginForm);
router.post("/login", userController.login);

router.post("/register", userController.register);
router.get("/register", userController.registerForm);

router.get("/confirm-account/:token", userController.confirmAccount);

//Private

router.get(
  "/dashboard",
  userController.userIsAuthenticated,
  adminController.renderDashboard
);
router.get(
  "/new-group",
  //userController.userIsAuthenticated,
  groupController.formNewGroup
);
router.post(
  "/new-group",
  //userController.userIsAuthenticated,
  groupController.createGroup
);

export default router;
