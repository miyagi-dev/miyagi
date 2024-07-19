/**
 * Module for setting the express engines
 * @module initEngines
 */

import engines from "@ladjs/consolidate";
import path from "path";
import {
	createEnvironment,
	createFilesystemLoader,
	createFunction,
} from "twing";
import fs from "fs";
import { t } from "../i18n/index.js";
import log from "../logger.js";
import * as helpers from "../helpers.js";

/**
 * @returns {void}
 */
function setMiyagiEngine() {
	let twing;
	let loader;

	if (global.config.engine.name == "twing" && global.config.engine.instance) {
		twing = global.config.engine.instance;
		loader = twing.loader;
	} else {
		loader = createFilesystemLoader(fs);
		twing = createEnvironment(loader);
	}

	loader.addPath(
		path.join(import.meta.dirname, "../../frontend/views"),
		"@miyagi",
	);

	twing.addFunction(
		createFunction(
			"is_expanded",
			(_context, item, requestedComponent) => {
				return new Promise((resolve) => {
					if (!requestedComponent) return resolve(false);

					return resolve(
						!!(
							item.children?.find(
								({ shortPath }) => shortPath === requestedComponent,
							) ||
							(item.shortPath && item.shortPath === requestedComponent) ||
							requestedComponent.startsWith(item.shortPath)
						),
					);
				});
			},
			[{ name: "item" }, { name: "requestedComponent" }],
		),
	);

	twing.addFunction(
		createFunction(
			"is_active_component",
			(_context, item, requestedComponent, requestedVariation) => {
				return new Promise((resolve) => {
					if (!requestedComponent) return resolve(false);

					if (requestedComponent === "design-tokens") {
						return resolve(
							item.section === "design-tokens" &&
								item.name == requestedVariation,
						);
					}

					return resolve(
						item.shortPath &&
							item.shortPath === requestedComponent &&
							!requestedVariation,
					);
				});
			},
			["item", "requestedComponent", "requestedVariation"],
		),
	);

	twing.addFunction(
		createFunction(
			"is_active_variant",
			(_context, item, requestedComponent, requestedVariation) => {
				return new Promise((resolve) => {
					if (!item || !requestedComponent || !requestedVariation)
						return resolve(false);

					return resolve(
						requestedComponent == item.parentShortPath &&
							requestedVariation == item.name,
					);
				});
			},
			["item", "requestedComponent", "requestedVariation"],
		),
	);

	global.app.engine("twig", async (str, options, cb) =>
		cb(await twing.render(str, options)),
	);
}

/**
 * @returns {boolean} describes if setting the engine was successful
 */
async function setUserEngine() {
	const { extension } = global.config.files.templates;
	const { engine, extensions, isBuild } = global.config;

	if (engine.instance && engine.name !== "twig") {
		engines.requires[engine.name] = engine.instance;
	}

	for (const extension of extensions) {
		const ext = Array.isArray(extension) ? extension[0] : extension;
		const opts =
			Array.isArray(extension) && extension[1] ? extension[1] : { locales: {} };

		if (ext.extendEngine) {
			engines.requires[engine.name] = await ext.extendEngine(opts, isBuild);
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
			engines[engine.name],
		);
		// eslint-disable-next-line no-unused-vars
	} catch (e) {
		log("error", t("settingEngineFailed"), e);
		return false;
	}

	return true;
}

export default function initEngines() {
	const userEngineSet = setUserEngine();
	setMiyagiEngine();

	return userEngineSet;
}
