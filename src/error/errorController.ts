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

	console.log(err);

	if (err.name === "PrismaClientInitializationError") {
		res.status(500).json({
			message: "Somethig wet wrog o our ed",
		});
	}

	if (err.name === "JsonWebTokenError") {
		res.status(401).json({
			status: "fail",
			message: "You are not logged in. PLease Login to get access",
		});
	}

	res.status(400).json({
		message: err,
	});
}
