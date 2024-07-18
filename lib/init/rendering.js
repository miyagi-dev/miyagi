import init from "./index.js";

/**
 * Runs the renderer to either start the server or create a build
 * @param {object} config - the user configuration object
 */
export default async function initRendering(config) {
	if (config) {
		return init(config);
	}
}
