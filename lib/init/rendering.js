const init = require(".");
const { updateConfigForRendererIfNecessary } = require("../helpers");

/**
 * Runs the renderer to either start the server or create a build
 *
 * @param {object} config - the user configuration object
 */
module.exports = async function initRendering(config) {
	config = await updateConfigForRendererIfNecessary(config);

	if (config) {
		return init(config);
	}
};
