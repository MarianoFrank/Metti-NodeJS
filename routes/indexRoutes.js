import express from "express";
import * as homeController from "../controllers/indexController.js";

const router = express.Router();

router.get("/", homeController.home);

export default router;
