import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import AsyncErrorHandler from "../error/asyncErrorHandler";
import { matchedData, validationResult } from "express-validator";
import { error } from "console";
import AppError from "../error/appError";
import readValidError from "../error/readValidError";

const prisma = new PrismaClient();

const login = AsyncErrorHandler(async function (req: Request, res: Response) {
	console.log(req.body);

	const newUser = await prisma.user.create({
		data: {
			firstName: "",
			lastName: "hdhddh",
			email: "dkddkd",
			password: "djjd",
			phone: "kewkek",
		},
	});

	res.status(200).json(newUser);
});

const register = function (req: Request, res: Response, next: NextFunction) {
	const result = validationResult(req);

	if (!result.isEmpty()) {
		next(new AppError(readValidError(result.array()), 400));
	}

	const data = matchedData(req);

	res.json(data);
};

export { login, register };
