import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";
import { matchedData } from "express-validator";
import { log } from "console";
import AsyncErrorHandler from "../error/asyncErrorHandler";

const createOrganisation = AsyncErrorHandler(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { name, description } = matchedData(req);
	const sanitzedName = String(name);
	const sanitzedDesc = req.body.description;

	const organisation = await prisma.organisation.create({
		data: {
			name: sanitzedName,
			description: sanitzedDesc === null || undefined ? "" : sanitzedDesc,
			users: {
				create: {
					userId: req.user.id,
				},
			},
		},
	});

	res.status(201).json({
		status: "success",
		message: "Organisation created successfully",
		data: {
			orgId: organisation.id,
			name: organisation.name,
			description: organisation.description,
		},
	});
});

const addUser = AsyncErrorHandler(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {});
export { createOrganisation, addUser };
