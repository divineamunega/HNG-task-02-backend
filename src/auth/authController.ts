import { Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

import AsyncErrorHandler from "../error/asyncErrorHandler";
import { matchedData, validationResult } from "express-validator";
import AppError from "../error/appError";

import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";

const prisma = new PrismaClient();

interface JwtPayload {
	id: string;
}

declare module "express-serve-static-core" {
	interface Request {
		user?: any;
	}
}

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
							name: `${firstName}'s Organisation`,
							description: `${firstName}'s default organisation`,
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

const protect = AsyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let token;
		// 1) Get the token and check if it's there
		if (req.headers.authorization?.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token)
			throw new AppError(
				"You are not logged in. Please Login to get access",
				401,
				{}
			);

		// 2) Verification token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as unknown as JwtPayload;

		const currentUser = await prisma.user.findUnique({
			where: { id: decoded.id },
		});

		if (!currentUser)
			next(
				new AppError(
					"You are not logged in. Please Login to get access",
					401,
					{}
				)
			);

		// Grant Access to protected route
		req.user = currentUser;
		next();
	}
);

export { login, register, protect };
