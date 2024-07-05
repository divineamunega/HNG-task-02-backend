import express from "express";
import { configDotenv } from "dotenv";
import server from "./app";
configDotenv({ path: "./.env" });

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});
