import fs from "fs";
import path from "path";
import { promisify } from "util";
import deepMerge from "deepmerge";
import { t } from "../i18n/index.js";
import * as helpers from "../helpers.js";
import log from "../logger.js";
import {
	extendTemplateData,
	getDataForRenderFunction,
} from "../render/helpers.js";

const fileStat = promisify(fs.stat);

/**
 * @param {string} method
 * @returns {Function}
 */
function getMergeMethod(method) {
	const methods = {
		combine: (target, source, options) => {
			const destination = target.slice();

			source.forEach((item, index) => {
				if (options.isMergeableObject(item)) {
					if (typeof destination[index] === "undefined") {
						destination[index] = options.cloneUnlessOtherwiseSpecified(
							item,
							options,
						);
					} else {
						destination[index] = deepMerge(target[index], item, options);
					}
				} else {
					destination[index] = options.cloneUnlessOtherwiseSpecified(
						item,
						options,
					);
				}
			});

			return destination;
		},

		overwrite: (destinationArray, sourceArray) => sourceArray,
	};

	return methods[method];
}

/**
 * @param {object} data - the mock data object that will be passed into the component
 * @param {object} [rootData] - the root mock data object
 * @returns {Promise<object>} the resolved data object
 */
export default async function resolveData(data, rootData) {
	let merged = rootData ? mergeRootDataWithVariationData(rootData, data) : data;
	let resolved;
	merged = mergeWithGlobalData(merged);
	resolved = await overwriteJsonLinksWithJsonData({ ...merged });
	resolved = await overwriteTplLinksWithTplContent(resolved);
	resolved = overwriteRenderKey(resolved);

	return { merged, resolved };
}

/**
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {Promise} gets resolved with resolved data object
 */
async function overwriteJsonLinksWithJsonData(data) {
	return new Promise((resolve) => iterateOverJsonData(data).then(resolve));
}

/**
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {Promise} gets resolved with resolved data object
 */
async function overwriteTplLinksWithTplContent(data) {
	return new Promise((resolve) => iterateOverTplData(data).then(resolve));
}

/**
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function iterateOverTplData(entry) {
	if (entry) {
		if (
			typeof entry === "string" ||
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			entry === null
		) {
			return entry;
		}

		if (entry instanceof Array) {
			const o = [];
			const promises = [];

			entry.forEach((entry, i) => {
				promises.push(
					new Promise((resolve, reject) => {
						resolveTpl(entry)
							.then((result) => iterateOverTplData(result))
							.then((result) => {
								o[i] = result;
								resolve();
							})
							.catch((err) => {
								console.error(err);
								reject();
							});
					}),
				);
			});

			return Promise.all(promises)
				.then(() => {
					return o;
				})
				.catch((err) => console.error(err));
		}

		const o = { ...entry };

		await Promise.all(
			Object.keys(o).map(async (key) => {
				o[key] = await resolveTpl(o[key]);
				o[key] = await iterateOverTplData(o[key]);
				return o[key];
			}),
		);

		return o;
	}

	return entry;
}

/**
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function iterateOverJsonData(entry) {
	if (entry) {
		if (
			typeof entry === "string" ||
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			entry === null
		) {
			return entry;
		}

		if (entry instanceof Array) {
			const o = [];
			const promises = [];

			entry.forEach((ent, i) => {
				promises.push(
					new Promise((resolve, reject) => {
						resolveJson(ent)
							.then((result) => iterateOverJsonData(result))
							.then((result) => {
								o[i] = result;
								resolve();
							})
							.catch((err) => {
								console.error(err);
								reject();
							});
					}),
				);
			});

			return Promise.all(promises)
				.then(() => {
					return o;
				})
				.catch((err) => console.error(err));
		}

		let o = entry;

		await Promise.all(
			Object.entries({ ...entry }).map(async ([key, value]) => {
				if (key === "$ref") {
					let resolvedValue = await getRootOrVariantDataOfReference(value);
					resolvedValue = await iterateOverJsonData(
						await resolveJson(resolvedValue),
					);
					o = { ...o, ...resolvedValue };
					delete o.$ref;
				} else {
					const resolvedValue = await iterateOverJsonData(
						await resolveJson(value),
					);

					o[key] = resolvedValue;
				}

				return true;
			}),
		);

		return o;
	}

	return entry;
}

/**
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise} gets resolved with the resolved value from the mock data object
 */
function resolveTpl(entry) {
	return new Promise((resolve1) => {
		if (entry) {
			if (Array.isArray(entry)) {
				const promises = [];
				const arr = [...entry];

				arr.forEach((o, i) => {
					promises.push(
						new Promise((resolve, reject) => {
							resolveTpl(o)
								.then((res) => {
									arr[i] = res;
									resolve();
								})
								.catch((err) => {
									console.error(err);
									reject();
								});
						}),
					);
				});

				return Promise.all(promises).then(() => {
					resolve1(arr);
				});
			}

			if (
				typeof entry === "string" ||
				typeof entry === "number" ||
				typeof entry === "boolean" ||
				entry === null
			) {
				return resolve1(entry);
			}

			const promises = [];
			let entries = { ...entry };

			Object.entries(entries).forEach(async ([key, val]) => {
				if (key !== "$tpl") {
					promises.push(
						new Promise((resolve, reject) => {
							resolveTpl(val)
								.then((result) => {
									entries[key] = result;
									resolve();
								})
								.catch((err) => {
									console.error(err);
									reject();
								});
						}),
					);
				}
			});

			return Promise.all(promises).then(async () => {
				if (entries.$tpl) {
					let data = { ...entries };
					delete data.$tpl;
					let filePath;
					let shortPath;
					let component;

					if (entries.$tpl.startsWith("@")) {
						const namespace = entries.$tpl.split("/")[0];
						const resolvedNamespace =
							global.config.engine.options.namespaces[namespace.slice(1)];

						const stat = await fileStat(path.resolve(resolvedNamespace));

						if (stat.isSymbolicLink()) {
							shortPath = entries.$tpl.replace(
								namespace,
								resolvedNamespace.replace(
									path.join(global.config.components.folder, "/"),
								),
								"",
							);
						} else {
							shortPath = path.relative(
								global.config.components.folder,
								entries.$tpl.replace(namespace, resolvedNamespace),
							);
						}
					} else {
						shortPath = entries.$tpl;
					}

					component = global.state.routes.find(
						({ alias }) => alias === shortPath,
					);

					fs.stat(component.paths.tpl.full, async function (err) {
						if (err == null) {
							data = await extendTemplateData(global.config, data, component);

							await global.app.render(
								component.paths.tpl.full,
								getDataForRenderFunction(data),
								(html) => {
									resolve1(html);
								},
							);
						} else if (err.code === "ENOENT") {
							const msg = t("templateDoesNotExist").replace(
								"{{template}}",
								filePath,
							);
							log("error", msg, err);
							resolve1(msg);
						}
					});
				} else {
					entries = overwriteRenderKey(entries);
					resolve1(entries);
				}
			});
		}

		return resolve1(entry);
	});
}

/**
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function resolveJson(entry) {
	if (entry !== null) {
		if (Array.isArray(entry)) {
			return entry;
		}

		if (
			typeof entry === "string" ||
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			entry === null
		) {
			return entry;
		}

		if (entry === undefined) {
			log("warn", t("referencedMockFileNotFound"));
			return entry;
		}

		if (entry.$ref) {
			const customData = helpers.cloneDeep(entry);
			delete customData.$ref;

			const resolvedJson = await getRootOrVariantDataOfReference(entry.$ref);

			return deepMerge(resolvedJson, customData);
		}
	}

	return entry;
}

/**
 * @param {string} ref - the reference to another mock data
 * @returns {object} the resolved data object
 */
async function getRootOrVariantDataOfReference(ref) {
	let [shortVal, variation] = ref.split("#");

	if (shortVal.startsWith("@")) {
		const namespace = shortVal.split("/")[0];
		const resolvedNamespace =
			global.config.engine.options.namespaces[namespace.slice(1)];
		const stat = await fileStat(path.resolve(resolvedNamespace));

		if (stat.isSymbolicLink()) {
			shortVal = shortVal.replace(
				namespace,
				resolvedNamespace.replace(
					path.join(global.config.components.folder, "/"),
					"",
				),
				"",
			);
		} else {
			shortVal = shortVal.replace(
				namespace,
				resolvedNamespace.replace(global.config.components.folder, ""),
				"",
			);
		}
	}

	const { mocks } = global.config.files;
	const mocksBaseName = `${shortVal}/${mocks.name}`;
	const jsonFromData =
		global.state.fileContents[
			helpers.getFullPathFromShortPath(`${mocksBaseName}.${mocks.extension[0]}`)
		] ||
		global.state.fileContents[
			helpers.getFullPathFromShortPath(`${mocksBaseName}.${mocks.extension[1]}`)
		];

	if (jsonFromData) {
		const embeddedJson = jsonFromData;
		let variantJson = {};
		const rootJson = helpers.removeInternalKeys(embeddedJson);

		if (variation && embeddedJson.$variants && embeddedJson.$variants.length) {
			const variant = embeddedJson.$variants.find((vari) => {
				if (vari.$name) {
					return (
						helpers.normalizeString(vari.$name) ===
						helpers.normalizeString(variation)
					);
				}
				return false;
			});

			if (variant) {
				variantJson = helpers.removeInternalKeys(variant);
			} else {
				log(
					"warn",
					t("variationNotFound")
						.replace("{{variation}}", variation)
						.replace("{{fileName}}", mocksBaseName),
				);
			}
		}

		return mergeRootDataWithVariationData(
			helpers.cloneDeep(rootJson),
			variantJson,
		);
	}
	log(
		"warn",
		t("fileNotFoundLinkIncorrect").replace("{{filePath}}", mocksBaseName),
	);

	return {};
}

/**
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {object} the resolved data object
 */
function overwriteRenderKey(data) {
	let o;

	if (data) {
		o = { ...data };
		const entries = Object.entries(o);
		for (const [key, val] of entries) {
			if (key === "$render") {
				let str = "";

				for (const html of val) {
					str += html;
				}

				o = str;
			} else {
				if (
					typeof val == "string" ||
					typeof val === "number" ||
					typeof val === "boolean" ||
					val === null
				) {
					o[key] = val;
				} else if (Array.isArray(val)) {
					val.forEach((v, i) => {
						if (
							typeof v == "string" ||
							typeof v === "number" ||
							typeof v === "boolean" ||
							val === null
						) {
							o[key][i] = v;
						} else {
							o[key][i] = overwriteRenderKey(v);
						}
					});
				} else {
					o[key] = overwriteRenderKey(val);
				}
			}
		}
	}

	return o;
}

/**
 * @param {object} rootData - the root mock data of a component
 * @param {object} variationData - a variation mock data of a component
 * @returns {object} the merged data
 */
function mergeRootDataWithVariationData(rootData, variationData) {
	if (!rootData) {
		return variationData;
	}

	if (!variationData) {
		return rootData;
	}

	const merged = deepMerge(rootData, variationData, {
		customMerge: (key) => {
			const options = variationData.$opts || rootData.$opts;

			if (options) {
				const option = options[key];

				if (option) {
					return getMergeMethod(option);
				}
			}

			return undefined;
		},
	});

	if (merged.$opts) {
		delete merged.$opts;
	}

	return merged;
}

/**
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {object} the merged data object
 */
function mergeWithGlobalData(data) {
	const defaultFile = helpers.getFullPathFromShortPath(
		`data.${global.config.files.mocks.extension[0]}`,
	);
	const jsFile = helpers.getFullPathFromShortPath(
		`data.${global.config.files.mocks.extension[1]}`,
	);

	return {
		...(global.state.fileContents[defaultFile] ||
			global.state.fileContents[jsFile]),
		...data,
	};
}
