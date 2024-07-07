import prisma from "../prismaClient";
import { NextFunction, Request, Response } from "express";

const getUserFromOrganisation = function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = req.params.id;

	const organizationIds = req.user.organizations.map(
		(org: any) => org.organizationId
	);

	const user = prisma.user.findUnique({
		where: {
			id: userId,
			organizations: {},
		},
	});
};

export { getUserFromOrganisation };
