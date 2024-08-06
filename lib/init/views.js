/**
 * Module for registering the views in express
 * @module initViews
 */

import path from "path";

/**
 * @returns {void}
 */
export default function initViews() {
	const views = [path.join(import.meta.dirname, "../../frontend/views")];

	if (global.config.components.folder) {
		views.push(path.resolve(global.config.components.folder));
	}

	global.app.set("views", views);
}
