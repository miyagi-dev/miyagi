/**
 * Module for getting all partials
 * @module statePartials
 */

import * as helpers from "../helpers.js";

export const getPartials = function (tree) {
	const partials = {};

	(function getPartials(entry) {
		if (entry.type === "file" && entry.name.endsWith(".twig")) {
			partials[helpers.getShortPathFromFullPath(entry.path)] = entry.path;
		} else if (entry.type === "directory") {
			entry.children.forEach((item) => getPartials(item));
		}
	})(tree.components);

	return partials;
};
