/**
 * Module for initializing miyagi
 *
 * @module init
 */

import express from "express";

import setEngines from "../lib/init/engines.js";
import setRouter from "../lib/init/router.js";
import setState from "../lib/state/index.js";
import setStatic from "../lib/init/static.js";
import setViews from "../lib/init/views.js";

export default async function init(mergedConfig) {
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
}
