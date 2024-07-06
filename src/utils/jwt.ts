import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

const signToken = (id: any) => {
	return jwt.sign({ id }, secret!, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

export { signToken };
