/**
 * Module for registering the views in express
 *
 * @module initViews
 */

const path = require("path");

module.exports = function initViews() {
	const views = [path.join(__dirname, "../../frontend/views")];

	if (global.config.components.folder) {
		views.push(path.resolve(global.config.components.folder));
	}

	global.app.set("views", views);
};
