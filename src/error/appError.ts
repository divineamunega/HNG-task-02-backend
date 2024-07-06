import { ValidationError } from "express-validator";

// PrismaClientKnownRequestError
export default class AppError extends Error {
	status: string;
	statusCode: number;
	isOperational: boolean;
	errorObj?: ValidationError[];
	constructor(message: string, statusCode: number, obj: any) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;
		this.errorObj = obj;
		Error.captureStackTrace(this, this.constructor);
	}
}
