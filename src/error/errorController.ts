import { Request, Response, NextFunction } from "express";
import AppError from "./appError";
export default function (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.status(400).json({
		data: {
			status: err.status,
			message: err.message,
		},
	});
}
