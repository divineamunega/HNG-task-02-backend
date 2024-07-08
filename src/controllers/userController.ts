import AppError from "../error/appError";
import asyncErrorHandler from "../error/asyncErrorHandler";
import prisma from "../prismaClient";
import { NextFunction, Request, Response } from "express";

const getUserFromOrganisation = asyncErrorHandler(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userIdToFind = req.params.id;
	const authenticatedUserId = req.user.id;

	const userOrganizations = await prisma.userOrganization.findMany({
		where: {
			userId: authenticatedUserId,
		},
		select: {
			organisationId: true,
		},
	});

	const organizationIds = userOrganizations.map((org) => org.organisationId);

	const userInSharedOrg = await prisma.userOrganization.findFirst({
		where: {
			organisationId: { in: organizationIds },
			userId: userIdToFind,
		},
		include: {
			user: true, // This includes the user information in the response
		},
	});

	console.log(userInSharedOrg);

	if (!userInSharedOrg) {
		return next(
			new AppError("User not found in any shared organizations", 404, {})
		);
	}

	res.status(200).json({
		status: "success",
		message: "User gotten succesfully",
		data: {
			userId: userInSharedOrg.user.id,
			firstName: userInSharedOrg.user.firstName,
			lastName: userInSharedOrg.user.lastName,
			email: userInSharedOrg.user.email,
			phone:
				userInSharedOrg.user.phone === null ? "" : userInSharedOrg.user.phone,
		},
	});
});

export { getUserFromOrganisation };
