import { body } from "express-validator";

function registerValidation() {
	return [
		body("firstName").notEmpty().withMessage("First name is required").trim(),
		body("lastName").notEmpty().withMessage("Last name is required"),
		body("email")
			.notEmpty()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Invalid email address")
			.normalizeEmail(),
		body("password")
			.notEmpty()
			.withMessage("Password is required!"),
		body("phone").optional(),
	];
}

export { registerValidation };
