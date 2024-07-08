import request from "supertest";
import app from "../src/app";
import prisma from "../src/prismaClient";
import { hash } from "bcrypt";

describe("Organization Access", () => {
	beforeAll(async () => {
		// Clean up the database
		await prisma.user.deleteMany();
		await prisma.organisation.deleteMany();
	});

	it("should not allow users to see data from organizations they do not belong to", async () => {
		// Create two users and organizations
		const hashedPassword = await hash("password", 12);

		const user1 = await prisma.user.create({
			data: {
				email: "user1@example.com",
				password: hashedPassword,
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
				password: hashedPassword,
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
			password: "password",
		});

		const token = loginResponse.body.token;

		const response = await request(app)
			.get(`/organizations/${organization.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(403);
		expect(response.body.message).toBe(
			"You're not a part of this organisation"
		);
	});

	afterAll(async () => {
		// Clean up the database
		await prisma.user.deleteMany({});
		await prisma.organisation.deleteMany({});
		await prisma.$disconnect();
	});
});
