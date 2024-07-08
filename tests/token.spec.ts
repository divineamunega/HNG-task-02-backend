import jwt, { JwtPayload } from "jsonwebtoken";
import { promisify } from "util";
import { expect } from "@jest/globals";
import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

describe("Token Generation", () => {
	it("should generate a token with the correct expiration and user details", async () => {
		const user = { id: "user1", email: "test@example.com" };
		const secret = process.env.JWT_SECRET;
		if (!secret) throw new Error("JWt secret must be defined");
		const token = jwt.sign(user, secret, {
			expiresIn: "1h",
		});

		const decoded = jwt.verify(token, secret) as unknown as JwtPayload;

		expect(decoded).toHaveProperty("id", "user1");
		expect(decoded).toHaveProperty("email", "test@example.com");
		expect(decoded).toHaveProperty("exp");
		expect(decoded.exp! * 1000).toBeLessThan(Date.now() + 3600000); // 1 hour
	});
});
