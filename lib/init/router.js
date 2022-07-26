/**
 * Module for accepting and routing requests
 *
 * @module initRouter
 */

const path = require("path");
const config = require("../config.json");
const render = require("../render");

/**
 * @param {string} component - the component directory
 * @returns {object} the mock data of the given component
 */
function getDataForComponent(component) {
	const { fileContents } = global.state;
	const { name, extension } = global.config.files.mocks;

	const defaultPath = path.join(
		component.paths.dir.full,
		`${name}.${extension[0]}`
	);

	const jsPath = path.join(component.paths.dir.full, `${name}.${extension[1]}`);

	return fileContents[defaultPath] || fileContents[jsPath];
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
				const routesEntry = global.state.routes.find(
					(route) => route.paths.dir.short === file
				);
				if (routesEntry) {
					if (routesEntry.type === "components") {
						if (routesEntry.paths.tpl) {
							return await render.renderMainComponent(
								checkIfRequestedVariationIsValid(routesEntry, variation)
									? {
											res,
											component: routesEntry,
											cookies: req.cookies,
											variation,
									  }
									: {
											res,
											component: routesEntry,
											cookies: req.cookies,
									  }
							);
						} else {
							return await render.renderMainComponentDocs({
								res,
								component: routesEntry,
								cookies: req.cookies,
							});
						}
					}
					if (routesEntry.type === "docs") {
						return await render.renderMainDocs({
							res,
							doc: routesEntry,
							cookies: req.cookies,
						});
					}
				}
				if (file === "all") {
					await render.renderMainIndex({ res, cookies: req.cookies });
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
				const routesEntry = global.state.routes.find(
					(route) => route.paths.dir.short === file
				);

				if (routesEntry) {
					if (routesEntry.type === "components") {
						if (routesEntry.paths.tpl) {
							if (
								variation &&
								checkIfRequestedVariationIsValid(routesEntry, variation)
							) {
								return await render.renderIframeVariation({
									res,
									component: routesEntry,
									variation,
									embedded,
									cookies: req.cookies,
								});
							} else {
								return await render.renderIframeComponent({
									res,
									component: routesEntry,
									cookies: req.cookies,
								});
							}
						} else {
							return await render.renderIframeComponentDocs({
								res,
								component: routesEntry,
								cookies: req.cookies,
							});
						}
					}
					if (routesEntry.type === "docs") {
						return await render.renderIframeDocs({
							res,
							doc: routesEntry,
							cookies: req.cookies,
						});
					}
				}
				if (file === "all") {
					await render.renderIframeIndex({ res, cookies: req.cookies });
				} else {
					res.redirect(302, global.config.indexPath.default);
				}
			} else {
				res.redirect(302, global.config.indexPath.default);
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
