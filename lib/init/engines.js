/**
 * Module for setting the express engines
 *
 * @module initEngines
 */

const engines = require("consolidate");
const twig = require("twig");
const config = require("../config.json");
const log = require("../logger.js");
const helpers = require("../helpers.js");

/**
 * @param {object} app - the express instance
 */
function setMiyagiEngine(app) {
	if (
		app.get("config").engine.name == "twig" &&
		app.get("config").engine.instance
	) {
		engines.requires.twig = app.get("config").engine.instance;
	} else {
		engines.requires.twig = twig;
	}

	engines.requires.twig.extendFunction(
		"is_expanded",
		(item, requestedComponent) => {
			if (!requestedComponent) return false;

			return !!(
				item.children?.find(
					({ shortPath }) => shortPath === requestedComponent
				) ||
				(item.shortPath && item.shortPath === requestedComponent) ||
				requestedComponent.startsWith(item.shortPath)
			);
		}
	);

	engines.requires.twig.extendFunction(
		"is_active_component",
		(item, requestedComponent, requestedVariation) => {
			return (
				item.shortPath &&
				item.shortPath === requestedComponent &&
				!requestedVariation
			);
		}
	);

	engines.requires.twig.extendFunction(
		"is_active_variant",
		(item, requestedComponent, requestedVariation) => {
			return (
				requestedComponent == item.parentShortPath &&
				requestedVariation == item.name
			);
		}
	);

	app.engine("twig", engines.twig);
}

/**
 * @param {object} app - the express instance
 * @returns {boolean} describes if setting the engine was successful
 */
async function setUserEngine(app) {
	const { extension } = app.get("config").files.templates;
	const { engine, extensions } = app.get("config");

	if (engine.instance && engine.name !== "twig") {
		engines.requires[engine.name] = engine.instance;
	}

	for (const extension of extensions) {
		const ext = Array.isArray(extension) ? extension[0] : extension;
		const opts =
			Array.isArray(extension) && extension[1] ? extension[1] : { locales: {} };

		if (ext.extendEngine) {
			engines.requires[engine.name] = await ext.extendEngine(opts);
		}

		if (!engines.requires[engine.name]) {
			if (ext.engine) {
				engines.requires[engine.name] = ext.engine;
			}
		}
	}

	try {
		app.engine(helpers.getSingleFileExtension(extension), engines[engine.name]);
	} catch (e) {
		log("error", config.messages.settingEngineFailed);
		return false;
	}

	return true;
}

module.exports = function initEngines(app) {
	setMiyagiEngine(app);
	const userEngineSet = setUserEngine(app);

	return userEngineSet;
};
