/**
 * Module for initializing miyagi
 * @module init
 */

const express = require("express");

const setEngines = require("../init/engines.js");
const setRouter = require("../init/router.js");
const setState = require("../state");
const setStatic = require("../init/static.js");
const setViews = require("../init/views.js");

module.exports = async function init(mergedConfig) {
	global.app = express();
	global.config = mergedConfig;
	global.app.set("view cache", false);
	global.app.set("cache", false);

	if (await setEngines()) {
		await setState({
			sourceTree: true,
			menu: true,
			partials: true,
			fileContents: true,
			css: true,
		});

		setStatic();
		setRouter();
		setViews();

		return global.app;
	}

	return false;
};
