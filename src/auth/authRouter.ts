import { Router } from "express";
import { login, register } from "./authController";
import { registerValidation } from "../validation/registerValidation";
import loginValidation from "../validation/loginValidation";

const router = Router();

router
	.post("/register", registerValidation(), register)
	.post("/login", loginValidation(), login);
export default router;
