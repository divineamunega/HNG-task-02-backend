import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import AsyncErrorHandler from "../error/asyncErrorHandler";
import { validationResult } from "express-validator";
import { error } from "console";

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

	if (result.isEmpty()) {
	}
	res.status(400).json({ errors: result.array() });
};

export { login, register };
