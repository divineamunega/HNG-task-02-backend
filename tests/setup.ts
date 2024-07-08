import { PrismaClient } from "@prisma/client";
import prisma from "../src/prismaClient";

const prismaClient = new PrismaClient();

beforeAll(async () => {
	await prismaClient.$connect();
});

afterAll(async () => {
	await prismaClient.$disconnect();
});

beforeEach(async () => {
	await prismaClient.user.deleteMany({});
	await prismaClient.organisation.deleteMany({});
});
