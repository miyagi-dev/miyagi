const appConfig = require("../../../lib/config.json");
const log = require("../../../lib/logger.js");
const setEngines = require("../../../lib/init/engines.js");
const setRouter = require("../../../lib/init/router.js");
const setState = require("../../../lib/state");
const setStatic = require("../../../lib/init/static.js");
const setViews = require("../../../lib/init/views.js");
const init = require("../../../lib/init");
require("../../../lib/init/watcher.js");

appConfig.defaultPort += 1;

jest.mock("../../../lib/logger.js");
jest.mock("../../../lib/init/config.js");
jest.mock("../../../lib/init/engines.js");
jest.mock("../../../lib/init/router.js");
jest.mock("../../../lib/init/static.js");
jest.mock("../../../lib/init/views.js");
jest.mock("../../../lib/init/watcher.js");
jest.mock("../../../lib/state");

/**
 *
 */
function getRandomPort() {
	return Math.floor(Math.random() * (65536 + 1));
}

beforeEach(() => {
	process.env.PORT = getRandomPort();
});

afterEach(() => {
	jest.resetModules();
	jest.resetAllMocks();
	process.env.PORT = undefined;
});

describe("lib/init", () => {
	describe("always", () => {
		test("calls setEngines", async () => {
			await init({});
			expect(setEngines).toHaveBeenCalled();
		});
	});

	describe("setEngines() was successful", () => {
		test("call init methods", async () => {
			setEngines.mockImplementationOnce(() => true);
			const server = await init({});
			expect(setState).toHaveBeenCalled();
			expect(setStatic).toHaveBeenCalled();
			expect(setRouter).toHaveBeenCalled();
			expect(setViews).toHaveBeenCalled();
			server.close();
		});

		describe("with process.env.PORT set", () => {
			test("sets app.port to process.env.PORT", async () => {
				setEngines.mockImplementationOnce(() => true);
				process.env.PORT = 1234;
				const server = await init({});
				expect(log).toHaveBeenCalledWith(
					"success",
					"Running miyagi server at http://localhost:1234!\n"
				);
				server.close();
			});
		});

		describe("without process.env.PORT set", () => {
			test("logs the correct port", async () => {
				setEngines.mockImplementationOnce(() => true);
				delete process.env.PORT;
				const server = await init({});
				expect(log).toHaveBeenCalledWith(
					"success",
					`Running miyagi server at http://localhost:${appConfig.defaultPort}!\n`
				);
				server.close();
			});
		});
	});

	describe("setEngines() was not successful", () => {
		test("doesn't call init methods", async () => {
			setEngines.mockImplementationOnce(() => false);
			await init({ ...appConfig, defaultPort: getRandomPort() });
			expect(setState).not.toHaveBeenCalled();
			expect(setStatic).not.toHaveBeenCalled();
			expect(setRouter).not.toHaveBeenCalled();
			expect(setViews).not.toHaveBeenCalled();
			expect(log).not.toHaveBeenCalled();
		});
	});
});
