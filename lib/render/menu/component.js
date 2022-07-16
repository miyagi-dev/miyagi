/**
 * Module for rendering a component in the menu
 *
 * @module renderMenuComponent
 */

const toggle = require("./toggle.js");
const variations = require("./variations.js");
const list = require("./list.js");
const classes = require("./classes.js");
const menuHelpers = require("./helpers.js");
const menu = require("./index.js");

/**
 * Renders a component in the menu
 *
 * @param {object} app - the express instance
 * @param {object} component - the component which should be rendered
 * @param {object} request - the request object
 * @returns {string} the component html
 */
function render(app, component, request) {
	const hasVariations = menuHelpers.componentHasVariations(component);
	let html = "";

	const current = request.path === component.shortPath && !request.variation;

	if (hasVariations || menuHelpers.shouldRenderWithToggle(component)) {
		const expanded = menuHelpers.pathIsParentOfOrEqualRequestedPath(
			component.shortPath,
			request.path
		);

		html += toggle.render(
			`${component.id}-variations`,
			expanded,
			component.index
		);
	}

	const href = app.get("config").isBuild
		? `component-${component.normalizedShortPath}-embedded.html`
		: `/component?file=${component.shortPath}&embedded=true`;

	html += `<a class="${classes.component} ${classes.component}--lvl${
		component.index
	} ${classes.link} ${classes.link}--lvl${
		component.index
	}" target="iframe" href="${href}"${current ? menuHelpers.activeState : ""}>${
		component.name
	}</a>`;

	html += `<div class="${classes.listContainer}"${
		component.id ? ` id="${component.id}-variations"` : ""
	}>`;

	if (hasVariations) {
		html += list.render(
			"variations",
			component.index,
			variations.render(app.get("config").isBuild, component, request)
		);
	}

	// starts recursion
	if (component.children && component.children.length) {
		html += menu.render(
			app,
			component.children,
			request,
			component.children.find((child) => typeof child.index !== "undefined")
				.index
		);
	}

	html += "</div>";

	return html;
}

module.exports = {
	render,
};
