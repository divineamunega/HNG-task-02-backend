import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import AsyncErrorHandler from "../error/asyncErrorHandler";
import { matchedData, validationResult } from "express-validator";
import AppError from "../error/appError";

import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";

const prisma = new PrismaClient();

const login = AsyncErrorHandler(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		next(new AppError("Authentication Failed", 401, {}));
	}

	const { email, password } = matchedData(req);
	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (!user) throw new AppError("Authentication Failed", 401, {});

	const authenticated = await bcrypt.compare(password, user.password);
	if (!authenticated) throw new AppError("Authentication Error", 401, {});

	const accessToken = signToken(user.id);

	res.status(200).json({
		status: "success",
		message: "Login Successful",
		data: {
			accessToken,
			user: {
				userId: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone === null ? undefined : user.phone,
			},
		},
	});
});

const register = AsyncErrorHandler(async function (
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
		data: {
			firstName,
			lastName,
			email,
			password: hashedPassword,
			phone,
			organizations: {
				create: {
					organisation: {
						create: {
							name: `${firstName}'s Organization`,
							description: `${firstName}'s default organization`,
						},
					},
				},
			},
		},
	});
	const accessToken = signToken(newUser.id);

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
