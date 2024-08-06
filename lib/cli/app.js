/**
 * Module for initializing miyagi
 * @module init
 */

import express from "express";

import setEngines from "../init/engines.js";
import setRouter from "../init/router.js";
import setState from "../state/index.js";
import setStatic from "../init/static.js";
import setViews from "../init/views.js";

/**
 * @param {object} mergedConfig
 * @returns {object}
 */
export default async function init(mergedConfig) {
	global.app = express();
	global.config = mergedConfig;
	global.app.set("view cache", false);
	global.app.set("cache", false);

	await setEngines();
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
