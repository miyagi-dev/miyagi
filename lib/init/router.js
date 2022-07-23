/**
 * Module for accepting and routing requests
 *
 * @module initRouter
 */

const path = require("path");
const helpers = require("../helpers.js");
const config = require("../config.json");
const render = require("../render");

/**
 * @param {string} component - the component directory
 * @returns {object} the mock data of the given component
 */
function getDataForComponent(component) {
	const { fileContents } = global.state;
	const { name, extension } = global.config.files.mocks;

	const defaultPath = helpers.getFullPathFromShortPath(
		path.join(component, `${name}.${extension[0]}`)
	);
	const jsPath = helpers.getFullPathFromShortPath(
		path.join(component, `${name}.${extension[1]}`)
	);

	return fileContents[defaultPath] || fileContents[jsPath];
}

/**
 * @param {string} component - the component directory
 * @returns {boolean} is true if the requested component is stored in state.fileContents
 */
function checkIfRequestedComponentIsValid(component) {
	if (!component) return false;

	const { fileContents } = global.state;

	const files = Object.keys(fileContents).map((file) =>
		file.replace(
			path.join(process.cwd(), global.config.components.folder, "/"),
			""
		)
	);
	const templateExtension = global.config.files.templates.extension;

	return files.includes(
		`${component}/${helpers.getResolvedFileName(
			global.config.files.templates.name,
			path.basename(component, `.${templateExtension}`)
		)}.${templateExtension}`
	);
}

/**
 * @param {string} component - the component directory
 * @returns {string}
 */
function checkIfRequestedFileIsDocFile(component) {
	if (!component) return false;

	const { fileContents } = global.state;
	const docsExtension = "md";

	if (component.endsWith(docsExtension)) {
		const var1 = path.join(
			process.cwd(),
			global.config.components.folder,
			component
		);

		if (var1 in fileContents) {
			return var1;
		}
	}

	const var1 = path.join(
		process.cwd(),
		global.config.components.folder,
		`${component}/${component}.${docsExtension}`
	);
	if (var1 in fileContents) {
		return var1;
	}

	const var2 = path.join(
		process.cwd(),
		global.config.components.folder,
		`${component}/README.${docsExtension}`
	);
	if (var2 in fileContents) {
		return var2;
	}

	const var3 = path.join(
		process.cwd(),
		global.config.components.folder,
		`${component}/index.${docsExtension}`
	);
	if (var3 in fileContents) {
		return var3;
	}

	const var4 = path.join(
		process.cwd(),
		global.config.components.folder,
		`${component}.md`
	);
	if (var4 in fileContents) {
		return var4;
	}

	return null;
}

/**
 * @param {object} data - mock data object
 * @param {string} variation - requested variation name
 * @returns {boolean} is true of the requested variation is in the given mock data
 */
function checkIfDataIncludesVariation(data, variation) {
	return (
		data.$variants &&
		data.$variants.length > 0 &&
		data.$variants.find((variant) => variant.$name === variation)
	);
}

/**
 * @param {string} component - the component directory
 * @param {string} variation - the requested variation name
 * @returns {boolean} is true if the requested variation exists in the mock data of the given component
 */
function checkIfRequestedVariationIsValid(component, variation) {
	const data = getDataForComponent(component);

	if (
		data &&
		(variation === data.$name || variation === config.defaultVariationName) &&
		!data.$hidden
	) {
		return true;
	}

	if (!data && variation === config.defaultVariationName) {
		return true;
	}

	return checkIfDataIncludesVariation(data, variation);
}

/**
 * @param {Function} middleware - async callback function for requests
 * @returns {Function} wrapped async function
 */
function awaitHandlerFactory(middleware) {
	return async (req, res, next) => {
		try {
			await middleware(req, res, next);
		} catch (err) {
			next(err);
		}
	};
}

module.exports = function Router() {
	global.app.get(
		"/show",
		awaitHandlerFactory(async (req, res) => {
			const { file, variation } = req.query;

			if (file) {
				const docFile = checkIfRequestedFileIsDocFile(file);

				if (file === "all") {
					await render.renderMainIndex({ res, cookies: req.cookies });
				} else if (checkIfRequestedComponentIsValid(file)) {
					if (variation) {
						if (checkIfRequestedVariationIsValid(file, variation)) {
							await render.renderMainComponent({
								res,
								file,
								variation,
								cookies: req.cookies,
							});
						} else {
							res.redirect(302, "/");
						}
					} else {
						await render.renderMainComponent({
							res,
							file,
							cookies: req.cookies,
						});
					}
				} else if (docFile) {
					await render.renderMainDocs({
						res,
						file: docFile.replace(
							path.join(process.cwd(), global.config.components.folder),
							""
						),
						cookies: req.cookies,
					});
				} else {
					res.redirect(302, "/");
				}
			} else {
				res.redirect(302, "/");
			}
		})
	);

	global.app.get(
		"/component",
		awaitHandlerFactory(async (req, res) => {
			const { file, variation, embedded } = req.query;

			if (file) {
				const docFile = checkIfRequestedFileIsDocFile(file);

				if (file === "all") {
					await render.renderIframeIndex({ res, cookies: req.cookies });
				} else if (checkIfRequestedComponentIsValid(file)) {
					if (variation) {
						if (checkIfRequestedVariationIsValid(file, variation)) {
							await render.renderIframeVariation({
								res,
								file,
								variation,
								embedded,
								cookies: req.cookies,
							});
						} else {
							res.redirect(302, "/component?file=all");
						}
					} else {
						await render.renderIframeComponent({
							res,
							file,
							cookies: req.cookies,
						});
					}
				} else if (docFile) {
					await render.renderIframeDocs({
						res,
						file,
						fullPath: docFile,
						cookies: req.cookies,
					});
				} else {
					res.redirect(302, "/component?file=all");
				}
			} else {
				res.redirect(302, "/component?file=all");
			}
		})
	);

	global.app.get(
		"/",
		awaitHandlerFactory(async (req, res) => {
			await render.renderMainIndex({ res, cookies: req.cookies });
		})
	);

	global.app.all("*", async (req, res) => {
		res.sendStatus(404);
	});
};
