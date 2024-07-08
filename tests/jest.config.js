module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFilesAfterEnv: ["./tests/setup.ts"],
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
		},
	},
};
