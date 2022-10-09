const init = require(".");

/**
 * Runs the renderer to either start the server or create a build
 *
 * @param {object} config - the user configuration object
 */
module.exports = async function initRendering(config) {
	if (config) {
		return init(config);
	}
};
