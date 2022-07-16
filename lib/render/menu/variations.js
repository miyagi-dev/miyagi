/**
 * Module for rendering a list of variations in the menu
 *
 * @module renderMenuVariations
 */

const listItem = require("./list-item.js");
const variationLink = require("./variation-link.js");
const helpers = require("./helpers.js");

/**
 * Renders the variations of a component in the menu
 *
 * @param {boolean} isBuild - renders a build or not
 * @param {object} component - the component whose variations should be rendered
 * @param {object} request - the request object
 * @returns {string} the html with list items
 */
function render(isBuild, component, request) {
	let html = "";

	for (const variation of component.variations) {
		const current = helpers.pathEqualsRequest(
			component.shortPath,
			variation,
			request
		);

		html += listItem.render(
			component.index,
			variationLink.render(isBuild, component, variation, current),
			"variation"
		);
	}

	return html;
}

module.exports = {
	render,
};
