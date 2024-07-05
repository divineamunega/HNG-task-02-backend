// PrismaClientKnownRequestError
export default class AppError extends Error {
	status: string;
	statusCode: string;
	isOperational: boolean;
	constructor(message: string, statusCode: string) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}
