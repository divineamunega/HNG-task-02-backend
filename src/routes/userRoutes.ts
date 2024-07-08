import { Router } from "express";
import { protect } from "../auth/authController";
import { getUserFromOrganisation } from "../controllers/userController";
import createOrganisationValidation from "../validation/createOrganisationValidation";

const router = Router();

router.get("/:id", protect, getUserFromOrganisation);
export default router;
