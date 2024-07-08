import { Request, Response, NextFunction } from "express";
import AppError from "./appError";
import { error } from "console";
export default function (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err.statusCode === 422) {
		res.status(err.statusCode).json({
			errors: err.errorObj?.map((obj: any) => {
				return {
					field: obj.path,
					message: obj.msg,
				};
			}),
		});
	}

	if (err.code && err.code === "P2002") {
		res.status(422).json({
			errors: [
				{
					field: err.meta.target[0],
					message: "This email already exist",
				},
			],
		});
	}

	if (err.statusCode === 401) {
		res.status(401).json({
			status: "Bad Request",
			message: err.message,
			statusCode: 401,
		});
	}

	if (err.name === "JsonWebTokenError") {
		res.status(401).json({
			status: "fail",
			message: "Could not log you in with that token. Login to get another",
		});
	}

	if (err.statusCode === 404) {
		res.status(404).json({
			status: "fail",
			message: err.message,
		});
	}

	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: "Bad Request",
			message: err.message,
		});
	}

	res.status(500).json({
		message: "Something went wrong on our end.",
	});
}
