import {
	describe,
	test,
	expect,
	vi,
	beforeEach,
	afterEach,
	beforeAll,
	afterAll,
} from "vitest";

import log from "../lib/logger.js";

const date = new Date(2024, 0, 1, 12, 30);

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(date);

	vi.spyOn(console, "error").mockImplementation(() => {});
	vi.spyOn(console, "warn").mockImplementation(() => {});
	vi.spyOn(console, "log").mockImplementation(() => {});
	vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe("non-verbose mode", () => {
	describe("error", () => {
		test("calls console.error", () => {
			const msg = "error message";

			log("error", msg);

			expect(console.error).toHaveBeenCalledTimes(1);
			expect(console.error).toHaveBeenCalledWith(
				`\x1b[90m2024/01/01 12:30:00 \x1b[31mError: \x1b[0m${msg}`,
			);
		});
	});

	describe("warning", () => {
		test("calls console.warn", () => {
			const msg = "warning message";

			log("warn", msg);

			expect(console.warn).toHaveBeenCalledTimes(1);
			expect(console.warn).toHaveBeenCalledWith(
				`\x1b[90m2024/01/01 12:30:00 \x1b[33mWarning: \x1b[0m${msg}`,
			);
		});
	});

	describe("success", () => {
		test("calls console.log", () => {
			const msg = "success message";

			log("success", msg);

			expect(console.log).toHaveBeenCalledTimes(1);
			expect(console.log).toHaveBeenCalledWith(
				`\x1b[90m2024/01/01 12:30:00 \x1b[32mSuccess: \x1b[0m${msg}`,
			);
		});
	});

	describe("info", () => {
		test("calls console.info", () => {
			const msg = "info message";

			log("info", msg);

			expect(console.info).toHaveBeenCalledTimes(1);
			expect(console.info).toHaveBeenCalledWith(
				`\x1b[90m2024/01/01 12:30:00 \x1b[36mInfo: \x1b[0m${msg}`,
			);
		});
	});
});

describe("verbose mode", () => {
	beforeAll(() => {
		process.env.VERBOSE = true;
	});

	afterAll(() => {
		process.env.VERBOSE = false;
	});

	describe("with message and verbose message", () => {
		describe("error", () => {
			test("calls console.error twice", () => {
				const msg = "error message";
				const verboseMsg = "verbose error message";

				log("error", msg, verboseMsg);

				expect(console.error).toHaveBeenCalledTimes(2);
				expect(console.error).toHaveBeenNthCalledWith(
					1,
					`\x1b[90m2024/01/01 12:30:00 \x1b[31mError: \x1b[0m${msg}`,
				);
				expect(console.error).toHaveBeenNthCalledWith(2, verboseMsg);
			});
		});

		describe("warning", () => {
			test("calls console.warn twice", () => {
				const msg = "warning message";
				const verboseMsg = "verbose warning message";

				log("warn", msg, verboseMsg);

				expect(console.warn).toHaveBeenCalledTimes(2);
				expect(console.warn).toHaveBeenNthCalledWith(
					1,
					`\x1b[90m2024/01/01 12:30:00 \x1b[33mWarning: \x1b[0m${msg}`,
				);
				expect(console.warn).toHaveBeenNthCalledWith(
					2,
					`\x1b[90m2024/01/01 12:30:00 \x1b[33mWarning: \x1b[0m${verboseMsg}`,
				);
			});
		});

		describe("success", () => {
			test("calls console.log twice", () => {
				const msg = "success message";
				const verboseMsg = "verbose success message";

				log("success", msg, verboseMsg);

				expect(console.log).toHaveBeenCalledTimes(2);
				expect(console.log).toHaveBeenNthCalledWith(
					1,
					`\x1b[90m2024/01/01 12:30:00 \x1b[32mSuccess: \x1b[0m${msg}`,
				);
				expect(console.log).toHaveBeenNthCalledWith(
					2,
					`\x1b[90m2024/01/01 12:30:00 \x1b[32mSuccess: \x1b[0m${verboseMsg}`,
				);
			});
		});

		describe("info", () => {
			test("calls console.info twice", () => {
				const msg = "info message";
				const verboseMsg = "verbose info message";

				log("info", msg, verboseMsg);

				expect(console.info).toHaveBeenCalledTimes(2);
				expect(console.info).toHaveBeenNthCalledWith(
					1,
					`\x1b[90m2024/01/01 12:30:00 \x1b[36mInfo: \x1b[0m${msg}`,
				);
				expect(console.info).toHaveBeenNthCalledWith(
					2,
					`\x1b[90m2024/01/01 12:30:00 \x1b[36mInfo: \x1b[0m${verboseMsg}`,
				);
			});
		});
	});

	describe("with verbose message only", () => {
		describe("error", () => {
			test("calls console.error twice", () => {
				const msg = "error message";
				const verboseMsg = "verbose error message";

				log("error", null, verboseMsg);

				expect(console.error).toHaveBeenCalledTimes(1);
				expect(console.error).toHaveBeenCalledWith(verboseMsg);
			});
		});

		describe("warning", () => {
			test("calls console.warn twice", () => {
				const verboseMsg = "verbose warning message";

				log("warn", null, verboseMsg);

				expect(console.warn).toHaveBeenCalledTimes(1);
				expect(console.warn).toHaveBeenCalledWith(
					`\x1b[90m2024/01/01 12:30:00 \x1b[33mWarning: \x1b[0m${verboseMsg}`,
				);
			});
		});

		describe("success", () => {
			test("calls console.log twice", () => {
				const verboseMsg = "verbose success message";

				log("success", null, verboseMsg);

				expect(console.log).toHaveBeenCalledTimes(1);
				expect(console.log).toHaveBeenCalledWith(
					`\x1b[90m2024/01/01 12:30:00 \x1b[32mSuccess: \x1b[0m${verboseMsg}`,
				);
			});
		});

		describe("info", () => {
			test("calls console.info twice", () => {
				const verboseMsg = "verbose info message";

				log("info", null, verboseMsg);

				expect(console.info).toHaveBeenCalledTimes(1);
				expect(console.info).toHaveBeenCalledWith(
					`\x1b[90m2024/01/01 12:30:00 \x1b[36mInfo: \x1b[0m${verboseMsg}`,
				);
			});
		});
	});
});
