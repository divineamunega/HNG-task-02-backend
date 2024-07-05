import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import AsyncErrorHandler from "../error/asyncErrorHandler";

const prisma = new PrismaClient();

const login = AsyncErrorHandler(async function (req: Request, res: Response) {
	console.log(req.body);

	const newUser = await prisma.user.create({
		data: {
			firstName: "Divine",
			lastName: "hdhddh",
			email: "dkddk",
			password: "djjd",
			phone: "kewkek",
		},
	});

	res.status(200).json(newUser);
});

const register = function (req: Request, res: Response, next: NextFunction) {
	res.send("Hello");
};

export { login, register };
