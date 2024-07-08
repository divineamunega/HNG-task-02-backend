import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";
import { matchedData, validationResult } from "express-validator";
import { log } from "console";
import AsyncErrorHandler from "../error/asyncErrorHandler";
import AppError from "../error/appError";

const createOrganisation = AsyncErrorHandler(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { name } = matchedData(req);
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
) {
	// Check if user exists
	const result = validationResult(req);
	if (!result.isEmpty()) {
		next(new AppError("Validation", 422, result.array()));
	}
	const { userId: USERID } = matchedData(req);
	const userId: any = USERID;
	const orgId = req.params.orgId;

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) next(new AppError(`No user found with id ${userId} `, 404, {}));

	// Check weather user is in  org
	const org = await prisma.organisation.findUnique({
		where: {
			id: orgId,
		},
	});

	if (!org) {
		return next(
			new AppError(`No organisation found with id ${orgId}`, 404, {})
		);
	}

	const adminUser = await prisma.user.findUnique({
		where: {
			id: req.user.id,
		},
		include: { organizations: { include: { organisation: true } } },
	});

	if (!adminUser)
		return next(new AppError("Please Login to Continue", 403, {}));

	// Extract organizations from the user object
	const organizations = adminUser.organizations.map(
		(userOrg) => userOrg.organisation
	);

	// Check if user is in org
	const isInOrg = organizations.find((org) => org.id === orgId);
	if (!isInOrg) {
		return next(
			new AppError(
				"Cannot add a user to an organisation you're not part of",
				403,
				{}
			)
		);
	}

	// Add user to organization
	await prisma.organisation.update({
		where: {
			id: orgId,
		},
		data: {
			users: {
				create: {
					userId: user?.id!,
				},
			},
		},
	});

	res.status(200).json({
		status: "success",
		message: `User added to organization successfully`,
	});
});

const getAllOrgnisations = AsyncErrorHandler(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = req.user.id;

	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { organizations: { include: { organisation: true } } },
	});

	if (!user) {
		return next(new AppError(`No user found with id ${userId}`, 404, {}));
	}

	// Extract organizations from the user object
	const organizations = user.organizations.map(
		(userOrg) => userOrg.organisation
	);

	res.status(200).json({
		staus: "success",
		message: "Organisation  Gotten  successfully",
		data: { organizations },
	});
});

const getOrganisationById = AsyncErrorHandler(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = req.user.id;
	const orgId = req.params.orgId;

	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { organizations: { include: { organisation: true } } },
	});

	if (!user) {
		return next(new AppError(`No user found with id ${userId}`, 404, {}));
	}

	// Extract organizations from the user object
	const organizations = user.organizations.find(
		(userOrg) => userOrg.organisation.id === orgId
	);

	if (!organizations) {
		return next(
			new AppError(`You're not a part of this organisation`, 403, {})
		);
	}

	res.status(200).json({
		status: "success",
		message: "Data gotten successfully",
		data: {
			orgId: organizations.organisation.id,
			name: organizations.organisation.name,
			description: organizations.organisation.description,
		},
	});
});
export { createOrganisation, addUser, getAllOrgnisations, getOrganisationById };
