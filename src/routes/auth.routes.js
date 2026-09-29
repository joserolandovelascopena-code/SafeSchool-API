import express from "express";
import { registrarUsuario } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registrarUsuario);

export default router;
