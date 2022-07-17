const express = require("express");
const path = require("path");
const deepMerge = require("deepmerge");
const setViews = require("../../../lib/init/views.js");
const config = require("../../../lib/config.json");

beforeEach(() => {
	jest.resetModules();
	jest.resetAllMocks();
});

describe("lib/init/views", () => {
	const app = express();
	app.set(
		"config",
		deepMerge(config.defaultUserConfig, {
			components: {
				folder: "src",
			},
		})
	);

	setViews(app);

	test("adds the internal views folder to the app instance", () => {
		expect(app.get("views")).toEqual([
			path.join(__dirname, "../../../frontend/views"),
			path.join(__dirname, "../../../src"),
		]);
	});

	test("adds the user components.folder to the app instance", () => {
		expect(app.get("views")).toContain(
			path.resolve(app.get("config").components.folder)
		);
	});

	test("adds exactly two views folders app instance", () => {
		expect(app.get("views").length).toBe(2);
	});
});
