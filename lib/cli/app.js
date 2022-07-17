/**
 * Module for initializing miyagi
 *
 * @module init
 */

const express = require("express");

const setEngines = require("../init/engines.js");
const setRouter = require("../init/router.js");
const setState = require("../state");
const setStatic = require("../init/static.js");
const setViews = require("../init/views.js");

module.exports = async function init(mergedConfig) {
	const app = express();
	app.set("config", mergedConfig);
	app.set("view cache", false);
	app.set("cache", false);

	if (await setEngines(app)) {
		await setState(app, {
			sourceTree: true,
			menu: true,
			partials: true,
			fileContents: true,
			css: true,
		});

		setStatic(app);
		setRouter(app);
		setViews(app);

		return app;
	}

	return false;
};
