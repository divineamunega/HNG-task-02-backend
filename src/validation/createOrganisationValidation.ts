import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import AppError from "../error/appError";
export default function () {
	return [
		body("name").notEmpty().withMessage("Organisation name cannot be empty"),
		function (req: Request, res: Response, next: NextFunction) {
			const result = validationResult(req);
			if (!result.isEmpty()) {
				next(new AppError("Validation", 422, result.array()));
			}
			next();
		},
	];
}
