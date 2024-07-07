import { Router } from "express";
import { protect } from "../auth/authController";
import { createOrganisation } from "../controllers/organisationsController";
import createOrganisationValidation from "../validation/createOrganisationValidation";
import { body } from "express-validator";

const router = Router();

router.post("/", createOrganisationValidation(), protect, createOrganisation);
export default router;
