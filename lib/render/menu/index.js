/**
 * Module for rendering the menu
 *
 * @module renderMenu
 */

const list = require("./list.js");

/**
 * @param {object} app - the express instance
 * @param {Array} children - all items in the menu
 * @param {object} request - the request object
 * @param {number} index - the depth level in the navigation
 * @returns {string} the html of the menu
 */
function render(app, children, request, index) {
	if (children.length) {
		return list.render(
			"components",
			index,
			(() => {
				let html = "";

				for (const child of children) {
					html += require("./menu-item.js").render(child, request, app);
				}

				return html;
			})()
		);
	}

	return "";
}

module.exports = {
	render,
};
