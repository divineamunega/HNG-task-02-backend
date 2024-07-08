import { NextFunction, Router } from "express";
import { protect } from "../auth/authController";
import {
	addUser,
	createOrganisation,
	getAllOrgnisations,
	getOrganisationById,
} from "../controllers/organisationsController";
import createOrganisationValidation from "../validation/createOrganisationValidation";
import { body, validationResult } from "express-validator";
import AppError from "../error/appError";

const router = Router();

router
	.get("/", protect, getAllOrgnisations)
	.get("/:orgId", protect, getOrganisationById)
	.post("/", createOrganisationValidation(), protect, createOrganisation)
	.post(
		"/:orgId/users",
		body("userId").notEmpty().withMessage("userId cannot be empty"),
		addUser
	);
export default router;
