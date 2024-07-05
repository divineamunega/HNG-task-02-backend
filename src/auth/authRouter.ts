import { Router } from "express";
import { login, register } from "./authController";
import { registerValidation } from "../validation/registerValidation";
import { body } from "express-validator";

const router = Router();

router.post("/register", registerValidation(), register).post("/login", login);
export default router;
