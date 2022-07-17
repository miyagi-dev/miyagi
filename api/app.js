/**
 * Module for initializing miyagi
 *
 * @module init
 */

const express = require("express");

const setEngines = require("../lib/init/engines.js");
const setRouter = require("../lib/init/router.js");
const setState = require("../lib/state");
const setStatic = require("../lib/init/static.js");
const setViews = require("../lib/init/views.js");

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
