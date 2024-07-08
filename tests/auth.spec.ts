import request from "supertest";
import app from "../src/server";
import prisma from "../src/prismaClient";

describe("Auth Endpoints", () => {
	it("should register a user successfully with a default organization", async () => {
		const response = await request(app).post("/auth/register").send({
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			password: "password123",
		});

		expect(response.status).toBe(201);
		expect(response.body.user).toHaveProperty("id");
		expect(response.body.user).toHaveProperty("email", "john@example.com");
		expect(response.body).toHaveProperty("token");

		const org = await prisma.organisation.findFirst({
			where: { name: "John's Organization" },
		});

		expect(org).not.toBeNull();
	});

	it("should log the user in successfully", async () => {
		// Register the user first
		await request(app).post("/auth/register").send({
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			password: "password123",
		});

		// Log in the user
		const response = await request(app).post("/auth/login").send({
			email: "jane@example.com",
			password: "password123",
		});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("token");
	});

	it("should fail if required fields are missing", async () => {
		const response = await request(app).post("/auth/register").send({
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		});

		expect(response.status).toBe(422);
		expect(response.body.errors).toHaveLength(5);
	});

	it("should fail if there is a duplicate email", async () => {
		// Register the user first
		await request(app).post("/auth/register").send({
			firstName: "Sam",
			lastName: "Smith",
			email: "sam@example.com",
			password: "password123",
		});

		// Try to register again with the same email
		const response = await request(app).post("/auth/register").send({
			firstName: "Sam",
			lastName: "Smith",
			email: "sam@example.com",
			password: "password123",
		});

		expect(response.status).toBe(422);
		expect(response.body.message).toBe("This email already exist");
	});
});
