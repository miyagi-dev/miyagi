const fs = require("fs");
const path = require("path");
const helpers = require("../helpers.js");
const render = require("../render/index.js");
const log = require("../logger.js");
const appConfig = require("../config.json");

/**
 * Module for creating a static build
 *
 * @module build
 */
module.exports = () => {
	return new Promise((resolve, reject) => {
		const config = { ...global.config };
		const { build } = config;
		const buildFolder = build.folder;
		const date = new Date();
		const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
		const buildDate = `${utcDate.getFullYear()}-${(utcDate.getMonth() + 1)
			.toString()
			.padStart(
				2,
				"0"
			)}-${utcDate.getDate()}T${utcDate.getHours()}:${utcDate.getMinutes()}:${utcDate.getSeconds()}Z`;
		const formattedBuildDate = `${utcDate.getFullYear()}/${(
			utcDate.getMonth() + 1
		)
			.toString()
			.padStart(
				2,
				"0"
			)}/${utcDate.getDate()} ${utcDate.getHours()}:${utcDate.getMinutes()}:${utcDate.getSeconds()} UTC`;

		config.ui.validations.accessibility = false;
		config.ui.validations.html = false;

		global.config = config;

		fs.rm(path.resolve(buildFolder), { recursive: true }, () => {
			fs.mkdir(path.resolve(buildFolder), { recursive: true }, () => {
				const promises = [];

				promises.push(
					new Promise((res, rej) => {
						buildDistDirectory(buildFolder).then(res).catch(rej);
					})
				);

				promises.push(
					new Promise((res, rej) => {
						buildUserFavicon(buildFolder, global.config.ui.theme.favicon)
							.then(res)
							.catch(rej);
					})
				);

				promises.push(
					new Promise((res, rej) => {
						buildUserAssets(buildFolder, global.config.assets, [
							global.config.ui.theme.dark.logo,
							global.config.ui.theme.light.logo,
						])
							.then(res)
							.catch(rej);
					})
				);

				promises.push(
					new Promise((res, rej) => {
						buildComponentAssets(
							buildFolder,
							global.state.components,
							global.config.components.folder
						)
							.then(res)
							.catch(rej);
					})
				);

				promises.push(
					new Promise((res, rej) => {
						buildIframeIndex(buildFolder).then(res).catch(rej);
					})
				);

				promises.push(
					new Promise((res, rej) => {
						buildIndex(buildFolder, buildDate, formattedBuildDate)
							.then(res)
							.catch(rej);
					})
				);

				const partials = Object.keys(global.state.partials);
				const files = partials.map((partial) => {
					return {
						file: partial,
						dir: path.dirname(partial),
					};
				});

				Object.keys(global.state.fileContents).forEach((file) => {
					if (file.endsWith("/README.md")) {
						const filePath = path.dirname(
							file.replace(
								path.join(process.cwd(), global.config.components.folder, "/"),
								""
							)
						);

						if (!files.find((file) => file.dir === filePath)) {
							files.push({
								file: null,
								dir: filePath,
							});
						}
					}
				});

				const paths = [];
				for (const { file, dir } of files) {
					promises.push(
						new Promise((res, rej) => {
							buildComponent({
								file,
								dir,
								buildFolder,
								buildDate,
								formattedBuildDate,
							})
								.then((component) => {
									if (component) {
										for (const path of getFilePathsForJsonOutput(
											buildFolder,
											component
										)) {
											paths.push(path);
										}
									}
									res();
								})
								.catch((err) => {
									rej(err);
								});
						})
					);
				}

				Promise.all(promises)
					.then(() => {
						if (global.config.build.outputFile) {
							createJsonOutputFile(buildFolder, paths, () => {
								log("success", appConfig.messages.buildDone);
								resolve();
							});
						} else {
							log("success", appConfig.messages.buildDone);
							resolve();
						}
					})
					.catch((err) => {
						log("error", appConfig.messages.buildFailed);
						reject(err);
					});
			});
		});
	});

	/**
	 * Creates an "output.json" file with the given array as content
	 *
	 * @param {string} buildFolder
	 * @param {Array} paths - all paths to standalone views of component variations
	 * @param {Function} cb
	 */
	function createJsonOutputFile(buildFolder, paths, cb) {
		fs.writeFile(
			path.join(buildFolder, "output.json"),
			JSON.stringify(
				paths.map((path) => {
					return {
						path,
					};
				}),
				null,
				2
			),
			cb
		);
	}

	/**
	 * Accepts an array with arrays and returns its values with cwd and buildFolder
	 *
	 * @param {string} buildFolder
	 * @param {Array} component - an array containing arrays with file paths
	 * @returns {Array} the flattened arrays
	 */
	function getFilePathsForJsonOutput(buildFolder, component) {
		const paths = [];

		for (const entries of component) {
			if (entries) {
				for (const file of entries) {
					if (file) {
						paths.push(
							file.replace(path.join(process.cwd(), buildFolder, "/"), "")
						);
					}
				}
			}
		}

		return paths;
	}

	/**
	 * Copies the user favicon
	 *
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @param {string} faviconPath - the favicon path from the user configuration
	 * @returns {Promise} gets resolved after the favicon has been copied
	 */
	function buildUserFavicon(buildFolder, faviconPath) {
		return new Promise((resolve) => {
			if (faviconPath) {
				fs.cp(
					path.join(process.cwd(), faviconPath),
					`${buildFolder}/favicon.ico`,
					{ recursive: true },
					resolve
				);
			} else {
				resolve();
			}
		});
	}

	/**
	 * Copies the dist directory
	 *
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @returns {Promise} gets resolved when the dist directory has been copied
	 */
	function buildDistDirectory(buildFolder) {
		return new Promise((resolve) =>
			fs.cp(
				path.join(__dirname, "../../dist/"),
				`${buildFolder}/miyagi/`,
				{
					recursive: true,
				},
				resolve
			)
		);
	}

	/**
	 *
	 * @param {string} buildFolder
	 * @param components
	 * @param componentsFolder
	 */
	async function buildComponentAssets(
		buildFolder,
		components,
		componentsFolder
	) {
		const promises = [];

		["css", "js"].forEach((type) => {
			components.forEach(({ assets }) => {
				if (assets[type]) {
					promises.push(
						new Promise((resolve) => {
							fs.cp(
								path.join(process.cwd(), componentsFolder, assets[type]),
								path.join(process.cwd(), buildFolder, assets[type]),
								{
									recursive: true,
								},
								resolve
							);
						})
					);
				}
			});
		});

		return Promise.all(promises);
	}

	/**
	 * Copies the user assets
	 *
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @param {object} assetsConfig - the assets object from the user configuration
	 * @param {Array} logoPaths - the logo paths from the user configuration
	 * @returns {Promise} gets resolved when all assets have been copied
	 */
	async function buildUserAssets(buildFolder, assetsConfig, logoPaths) {
		const promises = [];

		for (const folder of assetsConfig.folder) {
			promises.push(
				new Promise((resolve) => {
					fs.cp(
						path.resolve(path.join(assetsConfig.root, folder)),
						path.join(process.cwd(), buildFolder, folder),
						{
							recursive: true,
						},
						resolve
					);
				})
			);
		}

		if (logoPaths) {
			logoPaths.forEach((logoPath) => {
				if (
					logoPath &&
					assetsConfig.folder.filter((entry) => logoPath.startsWith(entry))
						.length === 0
				) {
					promises.push(
						new Promise((resolve) =>
							fs.cp(
								path.resolve(logoPath),
								path.join(buildFolder, logoPath),
								{ recursive: true },
								resolve
							)
						)
					);
				}
			});
		}

		const cssJsFiles = [
			...new Set([
				...assetsConfig.css.map((file) =>
					path.join(
						assetsConfig.root,
						typeof file === "string" ? file : file.src
					)
				),
				...assetsConfig.js.map((file) =>
					path.join(
						assetsConfig.root,
						typeof file === "string" ? file : file.src
					)
				),
				...assetsConfig.customProperties.files.map((file) =>
					path.join(assetsConfig.root, file)
				),
			]),
		];

		for (const file of cssJsFiles) {
			if (
				assetsConfig.folder.filter((entry) => file.startsWith(entry)).length ===
				0
			) {
				promises.push(
					new Promise((resolve) =>
						fs.cp(
							file,
							path.join(buildFolder, file),
							{ recursive: true },
							resolve
						)
					)
				);
			}
		}

		return Promise.all(promises);
	}

	/**
	 * Rendeers and builds the component overview
	 *
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @returns {Promise} gets resolved when the view has been rendered
	 */
	function buildIframeIndex(buildFolder) {
		const promises = [];

		for (const embedded of [false, true]) {
			promises.push(
				new Promise((resolve, reject) => {
					render
						.renderIframeIndex({
							res: global.app,
							cb: (err, response) => {
								if (err) {
									if (typeof err === "string") {
										log("error", err);
										reject(err);
									} else if (err.message) {
										log("error", err.message);
										reject(err.message);
									}
								} else {
									fs.writeFile(
										path.resolve(
											`${buildFolder}/component-all${
												embedded ? "-embedded" : ""
											}.html`
										),
										response,
										(err) => {
											if (err) {
												if (typeof err === "string") {
													log("error", err);
													reject(err);
												} else if (err.message) {
													log("error", err.message);
													reject(err.message);
												}
											} else {
												resolve();
											}
										}
									);
								}
							},
						})
						.catch((e) => reject(e));
				})
			);
		}

		return Promise.all(promises);
	}

	/**
	 * Renders and builds the index view
	 *
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @param {string} buildDate - a machine readable date time string of the current build
	 * @param {string} formattedBuildDate - a human readable date time string of the current build
	 * @returns {Promise} gets resolved when the view has been rendered
	 */
	function buildIndex(buildFolder, buildDate, formattedBuildDate) {
		return new Promise((resolve, reject) => {
			render.renderMainIndex({
				res: global.app,
				buildDate,
				formattedBuildDate,
				cb: (err, response) => {
					if (err) {
						if (typeof err === "string") {
							log("error", err);
							reject(err);
						} else if (err.message) {
							log("error", err.message);
							reject(err.message);
						}
					} else {
						fs.writeFile(
							path.resolve(`${buildFolder}/index.html`),
							response,
							(err) => {
								if (err) {
									if (typeof err === "string") {
										log("error", err);
										reject(err);
									} else if (err.message) {
										log("error", err.message);
										reject(err.message);
									}
								} else {
									resolve();
								}
							}
						);
					}
				},
			});
		});
	}

	/**
	 * Renders and builds a variation
	 *
	 * @param {object} object - parameter object
	 * @param {string} object.buildFolder - the build folder from the user configuration
	 * @param {string} object.file - the template file path
	 * @param {string} object.normalizedFileName - the normalized template file path
	 * @param {string} object.variation - the variation name
	 * @param {string} object.buildDate - a date time string of the current build
	 * @param {string} object.formattedBuildDate - a formatted date time string of the current build
	 * @returns {Promise} gets resolved when all variation views have been rendered
	 */
	function buildVariation({
		buildFolder,
		file,
		normalizedFileName,
		variation,
		buildDate,
		formattedBuildDate,
	}) {
		return new Promise((res, rej) => {
			const promises = [];

			for (const embedded of [false, true]) {
				promises.push(
					new Promise((resolve, reject) => {
						const fileName = path.resolve(
							`${buildFolder}/component-${normalizedFileName}-variation-${helpers.normalizeString(
								variation
							)}${embedded ? "-embedded" : ""}.html`
						);

						render.renderIframeVariation({
							res: global.app,
							file: path.dirname(file),
							variation,
							embedded,
							cb: (err, response) => {
								if (err) {
									if (typeof err === "string") {
										log("error", err);
										reject(err);
									} else if (err.message) {
										log("error", err.message);
										reject(err.message);
									}
								} else {
									fs.writeFile(fileName, response, (err) => {
										if (err) {
											if (typeof err === "string") {
												log("error", err);
												reject(err);
											} else if (err.message) {
												log("error", err.message);
												reject(err.message);
											}
										} else {
											if (embedded) {
												resolve(null);
											} else {
												resolve(fileName);
											}
										}
									});
								}
							},
						});
					})
				);
			}

			promises.push(
				new Promise((resolve, reject) => {
					render.renderMainComponent({
						res: global.app,
						file: path.dirname(file),
						variation,
						buildDate,
						formattedBuildDate,
						cb: (err, response) => {
							if (err) {
								if (typeof err === "string") {
									log("error", err);
									reject(err);
								} else if (err.message) {
									log("error", err.message);
									reject(err.message);
								}
							} else {
								fs.writeFile(
									path.resolve(
										`${buildFolder}/show-${normalizedFileName}-variation-${helpers.normalizeString(
											variation
										)}.html`
									),
									response,
									(err) => {
										if (err) {
											if (typeof err === "string") {
												log("error", err);
												reject(err);
											} else if (err.message) {
												log("error", err.message);
												reject(err.message);
											}
										} else {
											resolve();
										}
									}
								);
							}
						},
					});
				})
			);

			return Promise.all(promises).then(res).catch(rej);
		});
	}

	/**
	 * Renders and builds a variation
	 *
	 * @param {object} object - parameter object
	 * @param {string} object.file - the template file path
	 * @param {string} object.dir - the directory of the component
	 * @param {string} object.buildFolder - the build folder from the user configuration
	 * @param {string} object.buildDate - a date time string of the current build
	 * @param {string} object.formattedBuildDate - a formatted date time string of the current build
	 * @returns {Promise} gets resolved when all component views have been rendered
	 */
	function buildComponent({
		file,
		dir,
		buildFolder,
		buildDate,
		formattedBuildDate,
	}) {
		return new Promise((res, rej) => {
			const promises = [];
			const normalizedFileName = helpers.normalizeString(dir);
			const templateFilePath = helpers.getFullPathFromShortPath(file);
			const data =
				global.state.fileContents[
					helpers.getDataPathFromTemplatePath(
						templateFilePath,
						global.config.files.mocks.extension[0]
					)
				] ||
				global.state.fileContents[
					helpers.getDataPathFromTemplatePath(
						templateFilePath,
						global.config.files.mocks.extension[1]
					)
				];

			promises.push(
				new Promise((resolve, reject) => {
					render.renderMainComponent({
						res: global.app,
						file: dir,
						variation: null,
						buildDate,
						formattedBuildDate,
						cb: (err, response) => {
							if (err) {
								if (typeof err === "string") {
									log("error", err);
									reject(err);
								} else if (err.message) {
									log("error", err.message);
									reject(err.message);
								}
							} else {
								fs.writeFile(
									path.resolve(
										`${buildFolder}/show-${normalizedFileName}.html`
									),
									response,
									(err) => {
										if (err) {
											if (typeof err === "string") {
												log("error", err);
												reject(err);
											} else if (err.message) {
												log("error", err.message);
												reject(err.message);
											}
										} else {
											resolve();
										}
									}
								);
							}
						},
					});
				})
			);

			for (const embedded of [false, true]) {
				promises.push(
					new Promise((resolve, reject) => {
						render.renderIframeComponent({
							res: global.app,
							file: dir,
							noCli: embedded,
							cb: (err, response) => {
								if (err) {
									if (typeof err === "string") {
										log("error", err);
										reject(err);
									} else if (err.message) {
										log("error", err.message);
										reject(err.message);
									}
								} else {
									fs.writeFile(
										path.resolve(
											`${buildFolder}/component-${normalizedFileName}${
												-embedded ? "-embedded" : ""
											}.html`
										),
										response,
										(err) => {
											if (err) {
												if (typeof err === "string") {
													log("error", err);
													reject(err);
												} else if (err.message) {
													log("error", err.message);
													reject(err.message);
												}
											} else {
												resolve();
											}
										}
									);
								}
							},
						});
					})
				);
			}

			if (file) {
				let variations = [];

				if (data) {
					const dataWithoutInternalKeys = helpers.removeInternalKeys(data);

					if (
						!data.$hidden &&
						Object.keys(dataWithoutInternalKeys).length > 0
					) {
						variations.push({
							$name: data.$name || appConfig.defaultVariationName,
							...dataWithoutInternalKeys,
						});
					}

					if (data.$variants) {
						variations = [...variations, ...data.$variants];
					}
				} else {
					variations.push({
						$name: appConfig.defaultVariationName,
					});
				}

				for (const variation of variations) {
					const name = variation.$name;

					if (!name) break;

					promises.push(
						new Promise((resolve, reject) =>
							buildVariation({
								buildFolder,
								file,
								normalizedFileName,
								variation: name,
								buildDate,
								formattedBuildDate,
							})
								.then((fileName) => {
									resolve(fileName);
								})
								.catch((err) => {
									reject(err);
								})
						)
					);
				}
			}

			return Promise.all(promises).then(res).catch(rej);
		});
	}
};
