import express, { NextFunction, Request, Response } from "express";
import authRouter from "./auth/authRouter";
import morgan from "morgan";
import errorController from "./error/errorController";

const app = express();
app.use(morgan("tiny"));
app.use(express.json());
// Authentication
app.use("/auth", authRouter);

// app.use("/api/users");

// app.use("/api/organisations");
// app.use("/api/organisations");

// Route for unkown routes
app.use("*", (req, res) => {
	res.status(404).json({
		status: "fail",
		message: `The route ${req.originalUrl} with the ${req.method} method is not available on this api.`,
	});
});

// Global Error Handler
app.use(errorController);

export default app;
