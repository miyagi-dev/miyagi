/**
 * Module for registering the views in express
 *
 * @module initViews
 */

const path = require("path");

module.exports = function initViews(app) {
	app.set("views", [
		path.join(__dirname, "../../frontend/views"),
		path.resolve(app.get("config").components.folder),
	]);
};
