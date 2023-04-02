/**
 * Module for saving all relevant data
 *
 * @module state
 */

const { getPartials } = require("./partials.js");
const { getFileContents } = require("./file-contents.js");
const getCSS = require("./css");
const { getMenu } = require("./menu");
const getComponents = require("./components");
const { getSourceTree } = require("./source-tree.js");
const initStatic = require("../init/static");

module.exports = async function setState(methods) {
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
				global.state.sourceTree
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
			global.config.isBuild
		);
	}

	if (methods.css) {
		global.state.css = getCSS(global.state.fileContents);
	}

	initStatic();
	return global.state;
};
