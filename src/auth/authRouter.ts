import { Router } from "express";
import { login, register } from "./authController";

const router = Router();

router.post("/register", register).post("/login", login);
export default router;
