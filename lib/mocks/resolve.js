const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const deepMerge = require("deepmerge");
const fileStat = promisify(fs.stat);
const config = require("../config.json");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const {
	extendTemplateData,
	getDataForRenderFunction,
} = require("../render/helpers");

/**
 *
 * @param method
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
							options
						);
					} else {
						destination[index] = deepMerge(target[index], item, options);
					}
				} else {
					destination[index] = options.cloneUnlessOtherwiseSpecified(
						item,
						options
					);
				}
			});

			return destination;
		},

		overwrite: (destinationArray, sourceArray) => sourceArray,
	};

	return methods[method];
}

module.exports =
	/**
	 * @param {object} app - the express instance
	 * @param {object} data - the mock data object that will be passed into the component
	 * @param {object} [rootData] - the root mock data object
	 * @returns {Promise<object>} the resolved data object
	 */
	async function resolveData(app, data, rootData) {
		let merged = rootData
			? mergeRootDataWithVariationData(rootData, data)
			: data;
		let resolved;
		merged = mergeWithGlobalData(app, merged);
		resolved = await overwriteJsonLinksWithJsonData(app, { ...merged });
		resolved = await overwriteTplLinksWithTplContent(app, resolved);
		resolved = overwriteRenderKey(app, resolved);

		return { merged, resolved };
	};

/**
 * @param {object} app - the express instance
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {Promise} gets resolved with resolved data object
 */
async function overwriteJsonLinksWithJsonData(app, data) {
	return new Promise((resolve) => iterateOverJsonData(app, data).then(resolve));
}

/**
 * @param {object} app - the express instance
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {Promise} gets resolved with resolved data object
 */
async function overwriteTplLinksWithTplContent(app, data) {
	return new Promise((resolve) => iterateOverTplData(app, data).then(resolve));
}

/**
 * @param {object} app - the express instance
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function iterateOverTplData(app, entry) {
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
						resolveTpl(app, entry)
							.then((result) => iterateOverTplData(app, result))
							.then((result) => {
								o[i] = result;
								resolve();
							})
							.catch((err) => {
								console.error(err);
								reject();
							});
					})
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
				o[key] = await resolveTpl(app, o[key]);
				o[key] = await iterateOverTplData(app, o[key]);
				return o[key];
			})
		);

		return o;
	}

	return entry;
}

/**
 * @param {object} app - the express instance
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function iterateOverJsonData(app, entry) {
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
						resolveJson(app, ent)
							.then((result) => iterateOverJsonData(app, result))
							.then((result) => {
								o[i] = result;
								resolve();
							})
							.catch((err) => {
								console.error(err);
								reject();
							});
					})
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
					o = { ...o, ...(await getRootOrVariantDataOfReference(app, value)) };
				} else {
					const resolvedValue = await iterateOverJsonData(
						app,
						await resolveJson(app, value)
					);

					o[key] = resolvedValue;
				}

				return true;
			})
		);

		return o;
	}

	return entry;
}

/**
 * @param {object} app - the express instance
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise} gets resolved with the resolved value from the mock data object
 */
function resolveTpl(app, entry) {
	return new Promise((resolve1) => {
		if (entry) {
			if (Array.isArray(entry)) {
				const promises = [];
				const arr = [...entry];

				arr.forEach((o, i) => {
					promises.push(
						new Promise((resolve, reject) => {
							resolveTpl(app, o)
								.then((res) => {
									arr[i] = res;
									resolve();
								})
								.catch((err) => {
									console.error(err);
									reject();
								});
						})
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
							resolveTpl(app, val)
								.then((result) => {
									entries[key] = result;
									resolve();
								})
								.catch((err) => {
									console.error(err);
									reject();
								});
						})
					);
				}
			});

			return Promise.all(promises).then(async () => {
				if (entries.$tpl) {
					let data = { ...entries };
					delete data.$tpl;
					let filePath;
					let fullFilePath;

					if (entries.$tpl.startsWith("@")) {
						const namespace = entries.$tpl.split("/")[0];
						const resolvedNamespace =
							app.get("config").engine.options.namespaces[namespace.slice(1)];

						const stat = await fileStat(path.resolve(resolvedNamespace));

						if (stat.isSymbolicLink()) {
							filePath = `${entries.$tpl.replace(
								namespace,
								resolvedNamespace.replace(
									path.join(app.get("config").components.folder, "/"),
									""
								),
								""
							)}/${helpers.getResolvedFileName(
								app.get("config").files.templates.name,
								path.basename(entries.$tpl)
							)}.${app.get("config").files.templates.extension}`;

							fullFilePath = helpers.getFullPathFromShortPath(app, filePath);
						} else {
							filePath = `${entries.$tpl.replace(
								namespace,
								resolvedNamespace.replace(
									app.get("config").components.folder,
									""
								),
								""
							)}/${helpers.getResolvedFileName(
								app.get("config").files.templates.name,
								path.basename(entries.$tpl)
							)}.${app.get("config").files.templates.extension}`.slice(1);
						}

						fullFilePath = helpers.getFullPathFromShortPath(app, filePath);
					} else {
						filePath = `${entries.$tpl}/${helpers.getResolvedFileName(
							app.get("config").files.templates.name,
							path.basename(entries.$tpl)
						)}.${app.get("config").files.templates.extension}`;

						fullFilePath = helpers.getFullPathFromShortPath(app, filePath);
					}

					fs.stat(fullFilePath, async function (err) {
						if (err == null) {
							data = await extendTemplateData(
								app.get("config"),
								data,
								filePath
							);

							await app.render(
								filePath,
								getDataForRenderFunction(app, data),
								(err, html) => {
									if (err)
										log(
											"warn",
											config.messages.renderingTemplateFailed
												.replace("{{filePath}}", filePath)
												.replace("{{engine}}", app.get("config").engine.name)
										);

									resolve1(html);
								}
							);
						} else if (err.code === "ENOENT") {
							const msg = config.messages.templateDoesNotExist.replace(
								"{{template}}",
								filePath
							);
							log("error", msg);
							resolve1(msg);
						}
					});
				} else {
					entries = overwriteRenderKey(app, entries);
					resolve1(entries);
				}
			});
		}

		return resolve1(entry);
	});
}

/**
 * @param {object} app - the express instance
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function resolveJson(app, entry) {
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
			log("warn", config.messages.referencedMockFileNotFound);
			return entry;
		}

		if (entry.$ref) {
			const customData = helpers.cloneDeep(entry);
			delete customData.$ref;

			const resolvedJson = await getRootOrVariantDataOfReference(
				app,
				entry.$ref
			);

			return deepMerge(resolvedJson, customData);
		}
	}

	return entry;
}

/**
 * @param {object} app - the express instance
 * @param {string} ref - the reference to another mock data
 * @returns {object} the resolved data object
 */
async function getRootOrVariantDataOfReference(app, ref) {
	let [shortVal, variation] = ref.split("#");

	if (shortVal.startsWith("@")) {
		const namespace = shortVal.split("/")[0];
		const resolvedNamespace =
			app.get("config").engine.options.namespaces[namespace.slice(1)];
		const stat = await fileStat(path.resolve(resolvedNamespace));

		if (stat.isSymbolicLink()) {
			shortVal = shortVal.replace(
				namespace,
				resolvedNamespace.replace(
					path.join(app.get("config").components.folder, "/"),
					""
				),
				""
			);
		} else {
			shortVal = shortVal.replace(
				namespace,
				resolvedNamespace.replace(app.get("config").components.folder, ""),
				""
			);
		}
	}

	const { mocks } = app.get("config").files;
	const mocksBaseName = `${shortVal}/${mocks.name}`;
	const jsonFromData =
		app.get("state").fileContents[
			helpers.getFullPathFromShortPath(
				app,
				`${mocksBaseName}.${mocks.extension[0]}`
			)
		] ||
		app.get("state").fileContents[
			helpers.getFullPathFromShortPath(
				app,
				`${mocksBaseName}.${mocks.extension[1]}`
			)
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
					config.messages.variationNotFound
						.replace("{{variation}}", variation)
						.replace("{{fileName}}", mocksBaseName)
				);
			}
		}

		return mergeRootDataWithVariationData(
			helpers.cloneDeep(rootJson),
			variantJson
		);
	}
	log(
		"warn",
		config.messages.fileNotFoundLinkIncorrect.replace(
			"{{filePath}}",
			mocksBaseName
		)
	);

	return {};
}

/**
 * @param {object} app - the express instance
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {object} the resolved data object
 */
function overwriteRenderKey(app, data) {
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
							o[key][i] = overwriteRenderKey(app, v);
						}
					});
				} else {
					o[key] = overwriteRenderKey(app, val);
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
			const options = variationData.$opts;

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
 * @param {object} app - the express instance
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {object} the merged data object
 */
function mergeWithGlobalData(app, data) {
	const defaultFile = helpers.getFullPathFromShortPath(
		app,
		`data.${app.get("config").files.mocks.extension[0]}`
	);
	const jsFile = helpers.getFullPathFromShortPath(
		app,
		`data.${app.get("config").files.mocks.extension[1]}`
	);

	return {
		...(app.get("state").fileContents[defaultFile] ||
			app.get("state").fileContents[jsFile]),
		...data,
	};
}
