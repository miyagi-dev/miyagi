/**
 * Module for saving all relevant data
 * @module state
 */

import { getPartials } from "./partials.js";
import { getFileContents } from "./file-contents.js";
import getCSS from "./css.js";
import { getMenu } from "./menu/index.js";
import getComponents from "./components.js";
import { getSourceTree } from "./source-tree.js";

/**
 * @param {object} methods
 * @returns {Promise<object>}
 */
export default async function setState(methods) {
	if (!global.state) {
		global.state = {
			routes: [],
		};
	}

	if (methods.sourceTree) {
		global.state.routes = [];
		global.state.sourceTree = getSourceTree();
	}

	if (methods.fileContents) {
		if (typeof methods.fileContents === "object") {
			global.state.fileContents = methods.fileContents;
		} else {
			global.state.fileContents = await getFileContents(
				global.state.sourceTree,
			);
		}
	}

	if (methods.partials) {
		global.state.partials = getPartials(global.state.sourceTree);
	}

	if (methods.menu) {
		global.state.menu = getMenu(global.state.sourceTree);
		global.state.components = getComponents(
			global.state.menu,
			global.config.isBuild,
		);
	}

	if (methods.css) {
		global.state.css = getCSS(global.state.fileContents);
	}

	return global.state;
}
