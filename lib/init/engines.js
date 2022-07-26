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

function setMiyagiEngine() {
	if (global.config.engine.name == "twig" && global.config.engine.instance) {
		engines.requires.twig = global.config.engine.instance;
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
			if (!item) return false;

			return (
				requestedComponent == item.parentShortPath &&
				requestedVariation == item.name
			);
		}
	);

	global.app.engine("twig", engines.twig);
}

/**
 * @returns {boolean} describes if setting the engine was successful
 */
async function setUserEngine() {
	const { extension } = global.config.files.templates;
	const { engine, extensions } = global.config;

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
		global.app.engine(
			helpers.getSingleFileExtension(extension),
			engines[engine.name]
		);
	} catch (e) {
		log("error", config.messages.settingEngineFailed);
		return false;
	}

	return true;
}

module.exports = function initEngines() {
	setMiyagiEngine();
	const userEngineSet = setUserEngine();

	return userEngineSet;
};
