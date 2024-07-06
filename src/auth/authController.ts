import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

import AsyncErrorHandler from "../error/asyncErrorHandler";
import { matchedData, validationResult } from "express-validator";
import AppError from "../error/appError";

import asyncErrorHandler from "../error/asyncErrorHandler";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";

const prisma = new PrismaClient();

const login = AsyncErrorHandler(async function (req: Request, res: Response) {
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

const register = asyncErrorHandler(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		next(new AppError("Validation", 422, result.array()));
	}

	const { firstName, lastName, email, password, phone } = matchedData(req);
	const hashedPassword = await bcrypt.hash(password, 12);

	const newUser = await prisma.user.create({
		data: { firstName, lastName, email, password: hashedPassword, phone },
	});
	const accessToken = signToken(newUser.id);

	await prisma.organisation.create({
		data: { name: `${newUser.firstName}'s Organization`, description: "" },
	});

	res.status(201).json({
		status: "success",
		message: "Registration Successful",
		data: {
			accessToken,
			user: {
				userId: newUser.id,
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				email: newUser.email,
				phone: newUser.phone === null ? undefined : newUser.phone,
			},
		},
	});
});

export { login, register };
