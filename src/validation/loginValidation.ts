import { body } from "express-validator";
export default function () {
	return [
		body("email").notEmpty().isEmail(),
		body("password").isLength({ min: 8 }),
	];
}
