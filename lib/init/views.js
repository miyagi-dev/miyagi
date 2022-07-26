/**
 * Module for registering the views in express
 *
 * @module initViews
 */

const path = require("path");

module.exports = function initViews() {
	global.app.set("views", [
		path.join(__dirname, "../../frontend/views"),
		path.resolve(global.config.components.folder),
	]);
};
