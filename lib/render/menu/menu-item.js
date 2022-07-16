/**
 * Module for rendering an item in the menu
 *
 * @module renderMenuMenuitem
 */

const component = require("./component.js");
const directory = require("./directory.js");
const listItem = require("./list-item.js");
const helpers = require("./helpers.js");

/**
 * Renders a menu item for a directory in the menu
 *
 * @param {object} dir - the directory which should be rendered
 * @param {object} request - the request object
 * @param {object} app - the express instance
 * @returns {string} the html of the menu item
 */
function render(dir, request, app) {
	return listItem.render(
		dir.index,
		(() => {
			let html = "";
			if (helpers.directoryHasComponent(dir)) {
				html += component.render(app, dir, request);
			} else {
				html += directory.render(app, dir, request);
			}

			return html;
		})(),
		"directory"
	);
}

module.exports = {
	render,
};
