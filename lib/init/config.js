/**
 * Module for sanitizing the user configuration and merging it with the default configuration
 * @module initConfig
 */

import deepMerge from "deepmerge";
import log from "../logger.js";
import appConfig from "../default-config.js";
import { t, available as langAvailable } from "../i18n/index.js";
import fs from "fs";
import path from "path";

const { defaultUserConfig } = appConfig;

/**
 * @param {string} path - unsanitized directory or file path
 * @returns {string} the given path sanitized
 */
function sanitizePath(path) {
	if (path === null) return path;

	let sanitizedPath = path;

	if (sanitizedPath.startsWith("./")) {
		sanitizedPath = sanitizedPath.slice(2);
	} else if (sanitizedPath.startsWith("/")) {
		sanitizedPath = sanitizedPath.slice(1);
	}

	if (sanitizedPath === "." || sanitizedPath === "/") {
		sanitizedPath = "";
	}

	if (sanitizedPath.endsWith("/")) {
		sanitizedPath = sanitizedPath.slice(0, -1);
	}

	return sanitizedPath;
}

/**
 * @param {string|Array} strOrArr - file path or array of file paths
 * @returns {Array} the given file path in an array or simply the given array
 */
function arrayfy(strOrArr) {
	return Array.isArray(strOrArr) ? strOrArr : [strOrArr];
}

/**
 *
 * @param {object} root0
 * @param {string} root0.src
 * @param {boolean} [root0.defer]
 * @param {boolean} [root0.async]
 * @param {string} [root0.type]
 * @param {string} [root0.position]
 * @returns {object}
 */
function getJsFileObject({ src, defer, async, type, position = "head" }) {
	return {
		src,
		defer,
		async,
		type,
		position,
	};
}

/**
 * @param {string|Array|object} strOrArrOrObj - user assets files, either one file as string, an array of files or an object with strings or array for each NODE_ENV
 * @param {object} manifest - manifest object
 * @param {string} [manifest.file] - manifest file path
 * @param {object} [manifest.content] - parsed json content of manifest file
 * @param {string} root
 * @returns {string[]} converts the given object to an array of asset file path strings
 */
function getJsFilesArray(strOrArrOrObj, manifest, root) {
	if (!Array.isArray(strOrArrOrObj)) {
		log("warn", "config.assets.js is not an array.");
		return [];
	}

	let files = strOrArrOrObj.map((entry) =>
		typeof entry === "string" ? getJsFileObject({ src: entry }) : entry,
	);

	if (files.length > 0 && manifest.file && manifest.content) {
		files = files.map((file) => {
			const manifestEntry = getPathFromManifest(file.src, manifest, root);

			if (manifestEntry) {
				return {
					...file,
					src: path.join(path.dirname(manifest.file), manifestEntry),
				};
			} else {
				return file;
			}
		});
	}

	return files
		.filter((file) => typeof file.src === "string")
		.map((file) => ({
			...file,
			src: sanitizePath(file.src),
		}));
}

/**
 * @param {string|Array|object} strOrArrOrObj - user assets files, either one file as string, an array of files or an object with strings or array for each NODE_ENV
 * @param {object} manifest - manifest object
 * @param {string|null} [manifest.file] - manifest file path
 * @param {object} [manifest.content] - parsed json content of manifest file
 * @param {string} root
 * @returns {string[]} converts the given object to an array of asset file path strings
 */
function getCssFilesArray(strOrArrOrObj, manifest, root) {
	if (!Array.isArray(strOrArrOrObj)) {
		log("warn", "config.assets.css is not an array.");
		return [];
	}

	let files = strOrArrOrObj.filter((entry) => typeof entry === "string");

	if (files.length > 0 && manifest.content && manifest.file) {
		files = files.map((file) => {
			const manifestEntry = getPathFromManifest(file, manifest, root);

			if (manifestEntry) {
				return path.join(path.dirname(manifest.file), manifestEntry);
			} else {
				return file;
			}
		});
	}

	return files.map(sanitizePath);
}

/**
 * @param {string|Array|object} strOrArrOrObj
 * @returns {string[]} the given param converted to an array of asset file path strings
 */
function getAssetFoldersArray(strOrArrOrObj) {
	if (!Array.isArray(strOrArrOrObj)) {
		log("warn", "config.assets.folder is not an array.");
		return [];
	}

	return strOrArrOrObj
		.filter((entry) => typeof entry === "string")
		.map(sanitizePath);
}

/**
 * @param {object} [userConfig] the unmerged user configuration
 * @returns {object} the user configuration merged with the default configuration
 */
export default (userConfig = {}) => {
	const config = { ...userConfig };

	if (config.build) {
		if (config.build.basePath) {
			if (!config.build.basePath.startsWith("/")) {
				config.build.basePath = `/${config.build.basePath}`;
			}

			if (!config.build.basePath.endsWith("/")) {
				config.build.basePath = `${config.build.basePath}/`;
			}
		}
	}

	if (config.assets) {
		let manifest = {};

		if (config.assets.manifest) {
			try {
				const manifestContent = fs.readFileSync(
					path.resolve(
						path.join(config.assets.root || "", config.assets.manifest),
					),
					{ encoding: "utf8" },
				);

				manifest.file = config.assets.manifest;
				manifest.content = JSON.parse(manifestContent);

				// eslint-disable-next-line no-unused-vars
			} catch (e) {
				log(
					"warn",
					t("manifestNotFound").replace("{{manifest}}", config.assets.manifest),
				);
			}
		}

		if (config.assets.folder) {
			config.assets.folder = getAssetFoldersArray(config.assets.folder);
		}

		if (config.assets.css) {
			config.assets.css = getCssFilesArray(
				config.assets.css,
				manifest,
				config.assets.root,
			);
		}

		if (config.assets.js) {
			config.assets.js = getJsFilesArray(
				config.assets.js,
				manifest,
				config.assets.root,
			);
		}

		if (!config.assets.customProperties) {
			config.assets.customProperties = {};
		}

		if (Array.isArray(config.assets.customProperties.files)) {
			config.assets.customProperties.files =
				config.assets.customProperties.files.filter(
					(entry) => typeof entry === "string",
				);

			if (manifest?.content) {
				config.assets.customProperties.files =
					config.assets.customProperties.files.map((file) => {
						const manifestEntry = getPathFromManifest(
							file,
							manifest,
							config.assets.root,
						);

						if (manifestEntry) {
							return path.join(path.dirname(manifest.file), manifestEntry);
						} else {
							return file;
						}
					});
			}
		} else {
			log("warn", "config.assets.customProperties.files is not an array.");

			config.assets.customProperties.files = [];
		}
	}

	if (config.components) {
		if (config.components.ignores) {
			config.components.ignores = arrayfy(config.components.ignores).map(
				sanitizePath,
			);
		}
	}

	if (!config.ui) config.ui = {};
	if (!config.ui.theme) config.ui.theme = {};
	if (!config.ui.theme.light) config.ui.theme.light = {};
	if (!config.ui.theme.dark) config.ui.theme.dark = {};

	if (config.ui.theme.logo) {
		if (typeof config.ui.theme.logo === "string") {
			const { logo } = config.ui.theme;

			config.ui.theme.logo = {
				light: logo,
				dark: logo,
			};
		} else {
			if (config.ui.theme.logo.light && !config.ui.theme.logo.dark) {
				config.ui.theme.logo.dark = config.ui.theme.logo.light;
			} else if (config.ui.theme.logo.dark && !config.ui.theme.logo.light) {
				config.ui.theme.logo.light = config.ui.theme.logo.dark;
			}
		}

		if (config.ui.theme.logo.light) {
			config.ui.theme.logo.light = sanitizePath(config.ui.theme.logo.light);
		}
		if (config.ui.theme.logo.dark) {
			config.ui.theme.logo.dark = sanitizePath(config.ui.theme.logo.dark);
		}
	}

	const merged = deepMerge(defaultUserConfig, config);

	merged.components.folder = sanitizePath(merged.components.folder);

	// do this later as otherwise the deepMerge would do concatenation which we do not want
	if (config.files) {
		if (config.files.mocks) {
			if (config.files.mocks.extension) {
				merged.files.mocks.extension = arrayfy(config.files.mocks.extension);

				if (merged.files.mocks.extension.length === 1) {
					merged.files.mocks.extension.push(
						defaultUserConfig.files.mocks.extension[1],
					);
				}
			}
		}
	}

	if (!langAvailable.includes(merged.ui.lang)) {
		merged.ui.lang = "en";
	}

	return merged;
};

/**
 * @param {string} file
 * @param {object} manifest
 * @param {string} root
 * @returns {string|null}
 */
function getPathFromManifest(file, manifest, root = "") {
	const entry = Object.entries(manifest.content).find(([key]) => {
		return (
			path.resolve(root, path.dirname(manifest.file), sanitizePath(key)) ===
			path.resolve(root, sanitizePath(file))
		);
	});

	return entry ? entry[1] : null;
}
