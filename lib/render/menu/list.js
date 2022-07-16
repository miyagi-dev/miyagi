/**
 * Module for rendering a list in the menu
 *
 * @module renderMenuList
 */

const classes = require("./classes.js");

/**
 * Renders a list element with given content in the menu
 *
 * @param {string} type - can be "variations" or "components"
 * @param {number} index - the depth level of the list in the menu
 * @param {string} content - a html string with list items
 * @returns {string} the html of the menu item
 */
function render(type, index, content) {
	return `<ul class="${classes.list} ${classes.list}--lvl${index} ${classes.list}--${type}">${content}</ul>`;
}

module.exports = {
	render,
};
