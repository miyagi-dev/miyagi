/**
 * Module for initializing miyagi
 *
 * @module init
 */

const express = require("express");
const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");

const setEngines = require("../init/engines.js");
const setPartials = require("../init/partials.js");
const setRouter = require("../init/router.js");
const setState = require("../state");
const setStatic = require("../init/static.js");
const setViewHelpers = require("../init/view-helpers.js");
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
		setViewHelpers(app);
		await setPartials.registerAll(app);
		handlebarsLayouts.register(handlebars);

		return app;
	}

	return false;
};
