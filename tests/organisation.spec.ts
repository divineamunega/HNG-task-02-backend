import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { hash, compare } from "bcrypt";

describe("Organization Access", () => {
	beforeAll(async () => {
		// Clean up the database
		await prisma.$connect();
		await prisma.userOrganization.deleteMany({});
		await prisma.organisation.deleteMany({});
		await prisma.user.deleteMany({});
	}, 10000);

	it("should not allow users to see data from organizations they do not belong to", async () => {
		const password2 = await hash("password2", 12);
		const user1 = await prisma.user.create({
			data: {
				email: "user1@example.com",
				password: "password1",
				firstName: "name1",
				lastName: "lastname1",
				organizations: {
					create: {
						organisation: {
							create: {
								name: `name1's Organization`,
								description: `name1's default organization`,
							},
						},
					},
				},
			},
		});

		const user2 = await prisma.user.create({
			data: {
				email: "user2@example.com",
				password: password2,
				firstName: "name2",
				lastName: "lastname2",
				organizations: {
					create: {
						organisation: {
							create: {
								name: `name2's Organization`,
								description: `name2's default organization`,
							},
						},
					},
				},
			},
		});

		if (!user2) throw new Error("No user 2");

		const organization = await prisma.organisation.findFirst({
			where: {
				users: {
					some: { userId: user1.id },
				},
			},
		});

		if (!organization) throw new Error("Organization not found");

		// Log in user2 and try to access user1's organization data
		const loginResponse = await request(app).post("/auth/login").send({
			email: "user2@example.com",
			password: "password2",
		});

		const token = loginResponse.body.data.accessToken;

		const response = await request(app)
			.get(`/api/organisations/${organization.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(403);
		expect(response.body.message).toBe(
			"You're not a part of this organisation"
		);
	}, 30000);

	afterAll(async () => {
		// Clean up the database
		await prisma.userOrganization.deleteMany({});
		await prisma.organisation.deleteMany({});
		await prisma.user.deleteMany({});
		await prisma.$disconnect();
	}, 10000);
});
