import fs from "fs";
import path from "path";
import { readdir } from "node:fs/promises";
import * as helpers from "../helpers.js";
import render from "../render/index.js";
import appConfig from "../default-config.js";
import { t } from "../i18n/index.js";
import log from "../logger.js";

/**
 * Module for creating a static build
 * @module build
 */
export default () => {
	return new Promise((resolve, reject) => {
		const config = { ...global.config };
		const { build } = config;
		const buildFolder = build.folder;

		global.config = config;

		log("info", null, "Clearing build directory.");
		fs.rm(path.resolve(buildFolder), { recursive: true }, () => {
			log("info", null, "Creating build directory.");
			fs.mkdir(path.resolve(buildFolder), { recursive: true }, () => {
				const promises = [];

				promises.push(
					new Promise((res, rej) => {
						buildDistDirectory(buildFolder).then(res).catch(rej);
					}),
				);

				promises.push(
					new Promise((res, rej) => {
						buildUserFavicon(buildFolder, global.config.ui.theme.favicon)
							.then(res)
							.catch(rej);
					}),
				);

				promises.push(
					new Promise((res, rej) => {
						buildUserAssets(buildFolder, global.config.assets, [
							global.config.ui.theme.dark.logo,
							global.config.ui.theme.light.logo,
						])
							.then(res)
							.catch(rej);
					}),
				);

				promises.push(
					new Promise((res, rej) => {
						buildComponentAssets(
							buildFolder,
							global.state.components,
							global.config.components.folder,
						)
							.then(res)
							.catch(rej);
					}),
				);

				promises.push(
					new Promise((res, rej) => {
						buildIframeIndex(buildFolder).then(res).catch(rej);
					}),
				);

				promises.push(
					new Promise((res, rej) => {
						buildIframeDesignTokens(buildFolder)
							.then(() => {
								res();
							})
							.catch(rej);
					}),
				);

				promises.push(
					new Promise((res, rej) => {
						buildDesignTokens(buildFolder)
							.then(() => {
								res();
							})
							.catch(rej);
					}),
				);

				promises.push(
					new Promise((res, rej) => {
						buildIndex(buildFolder).then(res).catch(rej);
					}),
				);

				global.state.routes.forEach((route) => {
					if (route.type === "docs") {
						promises.push(
							new Promise((res, rej) => {
								buildDoc(route, buildFolder).then(res).catch(rej);
							}),
						);
					}
				});

				// const partials = Object.keys(global.state.partials);
				// const files = partials.map((partial) => {
				// 	return {
				// 		file: partial,
				// 		dir: path.dirname(partial),
				// 	};
				// });

				// Object.keys(global.state.fileContents).forEach((file) => {
				// 	if (file.endsWith("/README.md")) {
				// 		const filePath = path.dirname(
				// 			file.replace(
				// 				path.join(process.cwd(), global.config.components.folder, "/"),
				// 				""
				// 			)
				// 		);

				// 		if (!files.find((file) => file.dir === filePath)) {
				// 			files.push({
				// 				file: null,
				// 				dir: filePath,
				// 			});
				// 		}
				// 	}
				// });

				const paths = [];
				for (const route of global.state.routes) {
					if (route.type === "components") {
						promises.push(
							new Promise((res, rej) => {
								if (route.paths.tpl) {
									buildComponent({
										component: route,
										buildFolder,
									})
										.then((component) => {
											if (component) {
												for (const path of getFilePathsForJsonOutput(
													buildFolder,
													component,
												)) {
													paths.push(path);
												}
											}
											res();
										})
										.catch((err) => {
											rej(err);
										});
								} else {
									buildComponentDocs({
										component: route,
										buildFolder,
									})
										.then((component) => {
											if (component) {
												for (const path of getFilePathsForJsonOutput(
													buildFolder,
													component,
												)) {
													paths.push(path);
												}
											}
											res();
										})
										.catch((err) => {
											rej(err);
										});
								}
							}),
						);
					}
				}

				Promise.all(promises)
					.then(async () => {
						if (global.config.build.outputFile) {
							createJsonOutputFile(buildFolder, paths, async () => {
								resolve(
									t("buildDone").replace(
										"{{count}}",
										(await readdir(buildFolder, { recursive: true })).length,
									),
								);
							});
						} else {
							resolve(
								t("buildDone").replace(
									"{{count}}",
									(await readdir(buildFolder, { recursive: true })).length,
								),
							);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		});
	});

	/**
	 * Creates an "output.json" file with the given array as content
	 * @param {string} buildFolder
	 * @param {Array} paths - all paths → standalone views of component variations
	 * @param {Function} cb
	 */
	function createJsonOutputFile(buildFolder, paths, cb) {
		log("info", null, `Writing ${path.join(buildFolder, "output.json")}.`);
		fs.writeFile(
			path.join(buildFolder, "output.json"),
			JSON.stringify(
				paths.map((path) => {
					return {
						path,
					};
				}),
				null,
				2,
			),
			cb,
		);
	}

	/**
	 * Accepts an array with arrays and returns its values with cwd and buildFolder
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
							file.replace(path.join(process.cwd(), buildFolder, "/"), ""),
						);
					}
				}
			}
		}

		return paths;
	}

	/**
	 * Copies the user favicon
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @param {string} faviconPath - the favicon path from the user configuration
	 * @returns {Promise} gets resolved after the favicon has been copied
	 */
	function buildUserFavicon(buildFolder, faviconPath) {
		return new Promise((resolve) => {
			if (faviconPath) {
				log(
					"info",
					null,
					`Copying ${faviconPath} → ${buildFolder}/favicon.ico.`,
				);
				fs.cp(
					path.join(process.cwd(), faviconPath),
					`${buildFolder}/favicon.ico`,
					{ recursive: true },
					resolve,
				);
			} else {
				resolve();
			}
		});
	}

	/**
	 * Copies the dist directory
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @returns {Promise} gets resolved when the dist directory has been copied
	 */
	function buildDistDirectory(buildFolder) {
		log(
			"info",
			null,
			`Copying ${path.join(import.meta.dirname, "../../dist/")} → ${path.join(buildFolder, "/miyagi")}`,
		);
		return new Promise((resolve) =>
			fs.cp(
				path.join(import.meta.dirname, "../../dist/"),
				`${path.join(process.cwd(), buildFolder, "/miyagi")}`,
				{
					recursive: true,
				},
				resolve,
			),
		);
	}

	/**
	 *
	 * @param {string} buildFolder
	 * @param {string} components
	 * @param {string} componentsFolder
	 */
	async function buildComponentAssets(
		buildFolder,
		components,
		componentsFolder,
	) {
		const promises = [];

		["css", "js"].forEach((type) => {
			components.forEach(({ assets }) => {
				if (assets[type]) {
					promises.push(
						new Promise((resolve) => {
							log(
								"info",
								null,
								`Copying ${path.join(componentsFolder, assets[type])} → ${path.join(buildFolder, assets[type])}.`,
							);
							fs.cp(
								path.join(process.cwd(), componentsFolder, assets[type]),
								path.join(process.cwd(), buildFolder, assets[type]),
								{
									recursive: true,
								},
								resolve,
							);
						}),
					);
				}
			});
		});

		return Promise.all(promises);
	}

	/**
	 * Copies the user assets
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
					log(
						"info",
						null,
						`Copying ${path.join(assetsConfig.root, folder)} → ${path.join(buildFolder, folder)}`,
					);
					fs.cp(
						path.resolve(path.join(assetsConfig.root, folder)),
						path.join(process.cwd(), buildFolder, folder),
						{
							recursive: true,
						},
						resolve,
					);
				}),
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
						new Promise((resolve) => {
							log(
								"info",
								null,
								`Copying ${path.resolve(logoPath)} → ${path.join(buildFolder, logoPath)}`,
							);
							fs.cp(
								path.resolve(logoPath),
								path.join(buildFolder, logoPath),
								{ recursive: true },
								resolve,
							);
						}),
					);
				}
			});
		}

		const cssJsFiles = [
			...new Set([
				...assetsConfig.css.map((file) =>
					path.join(
						assetsConfig.root,
						typeof file === "string" ? file : file.src,
					),
				),
				...assetsConfig.js.map((file) =>
					path.join(
						assetsConfig.root,
						typeof file === "string" ? file : file.src,
					),
				),
				...assetsConfig.customProperties.files.map((file) =>
					path.join(assetsConfig.root, file),
				),
			]),
		];

		for (const file of cssJsFiles) {
			if (
				assetsConfig.folder.filter((entry) => file.startsWith(entry)).length ===
				0
			) {
				promises.push(
					new Promise((resolve) => {
						log(
							"info",
							null,
							`Copying ${file} → ${path.join(buildFolder, file)}`,
						);
						fs.cp(
							file,
							path.join(buildFolder, file),
							{ recursive: true },
							resolve,
						);
					}),
				);
			}
		}

		return Promise.all(promises);
	}

	/**
	 * Rendeers and builds the component overview
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
										reject(err);
									} else if (err.message) {
										reject(err.message);
									}
								} else {
									const filePath = path.join(
										buildFolder,
										embedded
											? global.config.indexPath.embedded
											: global.config.indexPath.default,
									);
									log("info", null, `Writing ${filePath}`);
									fs.writeFile(filePath, response, (err) => {
										if (err) {
											if (typeof err === "string") {
												reject(err);
											} else if (err.message) {
												reject(err.message);
											}
										} else {
											resolve();
										}
									});
								}
							},
						})
						.catch((e) => reject(e));
				}),
			);
		}

		return Promise.all(promises);
	}

	/**
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @returns {Promise} gets resolved when the view has been rendered
	 */
	function buildIframeDesignTokens(buildFolder) {
		const promises = [];

		for (const embedded of [false, true]) {
			for (const type of ["colors", "sizes", "typography"]) {
				promises.push(
					new Promise((resolve, reject) => {
						render.iframe.designTokens[type]({
							res: global.app,
							cb: (err, response) => {
								if (err) {
									if (typeof err === "string") {
										reject(err);
									} else if (err.message) {
										reject(err.message);
									}
								} else {
									const filePath = path.join(
										`${buildFolder}/iframe-design-tokens-${type}${
											embedded ? "-embedded" : ""
										}.html`,
									);
									log("info", null, `Writing ${filePath}`);
									fs.writeFile(filePath, response, (err) => {
										if (err) {
											if (typeof err === "string") {
												reject(err);
											} else if (err.message) {
												reject(err.message);
											}
										} else {
											resolve();
										}
									});
								}
							},
						}).catch((e) => reject(e));
					}),
				);
			}
		}

		return Promise.all(promises);
	}

	/**
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @returns {Promise} gets resolved when the view has been rendered
	 */
	function buildDesignTokens(buildFolder) {
		const promises = [];

		for (const type of ["colors", "sizes", "typography"]) {
			promises.push(
				new Promise((resolve, reject) => {
					render.renderMainDesignTokens({
						res: global.app,
						type,
						cb: (err, response) => {
							if (err) {
								if (typeof err === "string") {
									reject(err);
								} else if (err.message) {
									reject(err.message);
								}
							} else {
								const filePath = path.join(
									`${buildFolder}/design-tokens-${type}.html`,
								);
								log("info", null, `Writing ${filePath}`);
								fs.writeFile(filePath, response, (err) => {
									if (err) {
										if (typeof err === "string") {
											reject(err);
										} else if (err.message) {
											reject(err.message);
										}
									} else {
										resolve();
									}
								});
							}
						},
					});
				}),
			);
		}

		return Promise.all(promises);
	}

	/**
	 * Renders and builds the index view
	 * @param {string} buildFolder - the build folder from the user configuration
	 * @returns {Promise} gets resolved when the view has been rendered
	 */
	function buildIndex(buildFolder) {
		return new Promise((resolve, reject) => {
			render.renderMainIndex({
				res: global.app,
				cb: (err, response) => {
					if (err) {
						if (typeof err === "string") {
							reject(err);
						} else if (err.message) {
							reject(err.message);
						}
					} else {
						const filePath = path.join(`${buildFolder}/index.html`);
						log("info", null, `Writing ${filePath}`);
						fs.writeFile(filePath, response, (err) => {
							if (err) {
								if (typeof err === "string") {
									reject(err);
								} else if (err.message) {
									reject(err.message);
								}
							} else {
								resolve();
							}
						});
					}
				},
			});
		});
	}

	/**
	 * Renders and builds a variation
	 * @param {object} object - parameter object
	 * @param {string} object.buildFolder - the build folder from the user configuration
	 * @param {object} object.component
	 * @param {string} object.normalizedFileName - the normalized template file path
	 * @param {string} object.variation - the variation name
	 * @returns {Promise} gets resolved when all variation views have been rendered
	 */
	function buildVariation({
		buildFolder,
		component,
		normalizedFileName,
		variation,
	}) {
		return new Promise((res, rej) => {
			const promises = [];

			for (const embedded of [false, true]) {
				promises.push(
					new Promise((resolve, reject) => {
						const filePath = path.join(
							`${buildFolder}/component-components-${normalizedFileName}-variation-${helpers.normalizeString(
								variation,
							)}${embedded ? "-embedded" : ""}.html`,
						);

						render.renderIframeVariation({
							res: global.app,
							component,
							variation,
							embedded,
							cb: (err, response) => {
								if (err) {
									if (typeof err === "string") {
										reject(err);
									} else if (err.message) {
										reject(err.message);
									}
								} else {
									log("info", null, `Writing ${filePath}`);
									fs.writeFile(filePath, response, (err) => {
										if (err) {
											if (typeof err === "string") {
												reject(err);
											} else if (err.message) {
												reject(err.message);
											}
										} else {
											if (embedded) {
												resolve(null);
											} else {
												resolve(filePath);
											}
										}
									});
								}
							},
						});
					}),
				);
			}

			promises.push(
				new Promise((resolve, reject) => {
					render.renderMainComponent({
						res: global.app,
						component,
						variation,
						cb: (err, response) => {
							if (err) {
								if (typeof err === "string") {
									reject(err);
								} else if (err.message) {
									reject(err.message);
								}
							} else {
								const filePath = path.join(
									`${buildFolder}/show-components-${normalizedFileName}-variation-${helpers.normalizeString(
										variation,
									)}.html`,
								);
								log("info", null, `Writing ${filePath}`);
								fs.writeFile(filePath, response, (err) => {
									if (err) {
										if (typeof err === "string") {
											reject(err);
										} else if (err.message) {
											reject(err.message);
										}
									} else {
										resolve();
									}
								});
							}
						},
					});
				}),
			);

			return Promise.all(promises).then(res).catch(rej);
		});
	}

	/**
	 * Renders and builds a variation
	 * @param {object} object - parameter object
	 * @param {object} object.component
	 * @param {string} object.buildFolder - the build folder from the user configuration
	 * @returns {Promise} gets resolved when all component views have been rendered
	 */
	function buildComponent({ component, buildFolder }) {
		return new Promise((res, rej) => {
			const promises = [];
			const normalizedFileName = helpers.normalizeString(component.alias);
			const data =
				global.state.fileContents[
					component.paths.mocks.full(global.config.files.mocks.extension[0])
				] ||
				global.state.fileContents[
					component.paths.mocks.full(global.config.files.mocks.extension[1])
				];

			promises.push(
				new Promise((resolve, reject) => {
					render.renderMainComponent({
						res: global.app,
						component,
						variation: null,
						cb: (err, response) => {
							if (err) {
								if (typeof err === "string") {
									reject(err);
								} else if (err.message) {
									reject(err.message);
								}
							} else {
								const filePath = path.join(
									`${buildFolder}/show-components-${normalizedFileName}.html`,
								);
								log("info", null, `Writing ${filePath}`);
								fs.writeFile(filePath, response, (err) => {
									if (err) {
										if (typeof err === "string") {
											reject(err);
										} else if (err.message) {
											reject(err.message);
										}
									} else {
										resolve();
									}
								});
							}
						},
					});
				}),
			);

			for (const embedded of [false, true]) {
				if (component.paths.tpl) {
					promises.push(
						new Promise((resolve, reject) => {
							render.renderIframeComponent({
								res: global.app,
								component,
								noCli: embedded,
								cb: (err, response) => {
									if (err) {
										if (typeof err === "string") {
											reject(err);
										} else if (err.message) {
											reject(err.message);
										}
									} else {
										const filePath = path.join(
											`${buildFolder}/component-components-${normalizedFileName}${
												-embedded ? "-embedded" : ""
											}.html`,
										);
										log("info", null, `Writing ${filePath}`);
										fs.writeFile(filePath, response, (err) => {
											if (err) {
												if (typeof err === "string") {
													reject(err);
												} else if (err.message) {
													reject(err.message);
												}
											} else {
												resolve();
											}
										});
									}
								},
							});
						}),
					);
				}
			}

			if (component.paths.tpl) {
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
								component,
								normalizedFileName,
								variation: name,
							})
								.then((fileName) => {
									resolve(fileName);
								})
								.catch((err) => {
									reject(err);
								}),
						),
					);
				}
			}

			return Promise.all(promises).then(res).catch(rej);
		});
	}

	/**
	 * Renders and builds a variation
	 * @param {object} object - parameter object
	 * @param {object} object.component
	 * @param {string} object.buildFolder - the build folder from the user configuration
	 * @returns {Promise} gets resolved when all component views have been rendered
	 */
	function buildComponentDocs({ component, buildFolder }) {
		return new Promise((res, rej) => {
			const promises = [];
			const normalizedFileName = helpers.normalizeString(component.alias);

			promises.push(
				new Promise((resolve, reject) => {
					render.renderMainComponentDocs({
						res: global.app,
						component,
						variation: null,
						cb: (err, response) => {
							if (err) {
								if (typeof err === "string") {
									reject(err);
								} else if (err.message) {
									reject(err.message);
								}
							} else {
								const filePath = path.join(
									`${buildFolder}/show-components-${normalizedFileName}.html`,
								);
								log("info", null, `Writing ${filePath}`);
								fs.writeFile(filePath, response, (err) => {
									if (err) {
										if (typeof err === "string") {
											reject(err);
										} else if (err.message) {
											reject(err.message);
										}
									} else {
										resolve();
									}
								});
							}
						},
					});
				}),
			);

			for (const embedded of [false, true]) {
				promises.push(
					new Promise((resolve, reject) => {
						render.renderIframeComponentDocs({
							res: global.app,
							component,
							noCli: embedded,
							cb: (err, response) => {
								if (err) {
									if (typeof err === "string") {
										reject(err);
									} else if (err.message) {
										reject(err.message);
									}
								} else {
									const filePath = path.join(
										`${buildFolder}/component-components-${normalizedFileName}${
											-embedded ? "-embedded" : ""
										}.html`,
									);
									log("info", null, `Writing ${filePath}`);
									fs.writeFile(filePath, response, (err) => {
										if (err) {
											if (typeof err === "string") {
												reject(err);
											} else if (err.message) {
												reject(err.message);
											}
										} else {
											resolve();
										}
									});
								}
							},
						});
					}),
				);
			}

			return Promise.all(promises).then(res).catch(rej);
		});
	}

	/**
	 * @param {object} doc
	 * @param {string} buildFolder
	 * @returns {Promise}
	 */
	function buildDoc(doc, buildFolder) {
		const normalizedFileName = helpers.normalizeString(doc.paths.dir.short);
		const promises = [];

		promises.push(
			new Promise((resolve, reject) => {
				render.renderMainDocs({
					res: global.app,
					doc,
					cb: (err, response) => {
						if (err) {
							if (typeof err === "string") {
								reject(err);
							} else if (err.message) {
								reject(err.message);
							}
						} else {
							const filePath = path.join(
								`${buildFolder}/show-${normalizedFileName}.html`,
							);
							log("info", null, `Writing ${filePath}`);
							fs.writeFile(filePath, response, (err) => {
								if (err) {
									if (typeof err === "string") {
										reject(err);
									} else if (err.message) {
										reject(err.message);
									}
								} else {
									resolve();
								}
							});
						}
					},
				});
			}),
		);

		for (const embedded of [false, true]) {
			promises.push(
				new Promise((resolve, reject) => {
					render.renderIframeDocs({
						res: global.app,
						doc,
						noCli: embedded,
						cb: (err, response) => {
							if (err) {
								if (typeof err === "string") {
									reject(err);
								} else if (err.message) {
									reject(err.message);
								}
							} else {
								const filePath = path.join(
									`${buildFolder}/component-${normalizedFileName}${
										-embedded ? "-embedded" : ""
									}.html`,
								);
								log("info", null, `Writing ${filePath}`);
								fs.writeFile(filePath, response, (err) => {
									if (err) {
										if (typeof err === "string") {
											reject(err);
										} else if (err.message) {
											reject(err.message);
										}
									} else {
										resolve();
									}
								});
							}
						},
					});
				}),
			);
		}

		return Promise.all(promises);
	}
};
