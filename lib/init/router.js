/**
 * Module for accepting and routing requests
 * @module initRouter
 */

import path from "path";
import config from "../default-config.js";
import render from "../render/index.js";
import { getVariationData } from "../mocks/index.js";
import log from "../logger.js";

/**
 * @param {object} component
 * @returns {object} the mock data of the given component
 */
function getDataForComponent(component) {
	const { fileContents } = global.state;
	const { name, extension } = global.config.files.mocks;

	const defaultPath = path.join(
		component.paths.dir.full,
		`${name}.${extension[0]}`,
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
	return data?.$variants?.find((variant) => variant.$name === variation);
}

/**
 * @param {object} component
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
 * @returns {void}
 */
export default function Router() {
	global.app.get("/design-tokens/colors", async (req, res) => {
		return render.renderMainDesignTokens({
			res,
			cookies: req.cookies,
			type: "colors",
		});
	});

	global.app.get("/iframe/design-tokens/colors", async (req, res) => {
		return render.iframe.designTokens.colors({ res, cookies: req.cookies });
	});

	global.app.get("/design-tokens/sizes", async (req, res) => {
		return render.renderMainDesignTokens({
			res,
			cookies: req.cookies,
			type: "sizes",
		});
	});

	global.app.get("/iframe/design-tokens/sizes", async (req, res) => {
		return render.iframe.designTokens.sizes({ res, cookies: req.cookies });
	});

	global.app.get("/design-tokens/typography", async (req, res) => {
		return render.renderMainDesignTokens({
			res,
			cookies: req.cookies,
			type: "typography",
		});
	});

	global.app.get("/iframe/design-tokens/typography", async (req, res) => {
		return render.iframe.designTokens.typography({
			res,
			cookies: req.cookies,
		});
	});

	global.app.get("/show", async (req, res) => {
		const { file, variation } = req.query;

		if (!file) {
			return res.redirect(302, "/");
		}

		if (file === "all") {
			return await render.renderMainIndex({ res, cookies: req.cookies });
		}

		const routesEntry = global.state.routes.find(
			(route) => route.paths.dir.short === file,
		);

		if (!routesEntry) {
			return res.redirect(302, "/");
		}

		switch (routesEntry.type) {
			case "components": {
				if (!routesEntry.paths.tpl) {
					return await render.renderMainComponentDocs({
						res,
						component: routesEntry,
						cookies: req.cookies,
					});
				}

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
							},
				);
			}

			case "docs": {
				return await render.renderMainDocs({
					res,
					doc: routesEntry,
					cookies: req.cookies,
				});
			}

			default:
				return res.redirect(302, "/");
		}
	});

	global.app.get("/component", async (req, res) => {
		const { file, variation, embedded } = req.query;

		if (!file) {
			return res.redirect(302, global.config.indexPath.default);
		}

		if (file === "all") {
			return await render.renderIframeIndex({ res, cookies: req.cookies });
		}

		const routesEntry = global.state.routes.find(
			(route) => route.paths.dir.short === file,
		);

		if (!routesEntry) {
			res.redirect(302, global.config.indexPath.default);
		}

		switch (routesEntry.type) {
			case "components": {
				if (!routesEntry.paths.tpl) {
					return await render.renderIframeComponentDocs({
						res,
						component: routesEntry,
						cookies: req.cookies,
					});
				}

				if (
					!variation ||
					!checkIfRequestedVariationIsValid(routesEntry, variation)
				) {
					return await render.renderIframeComponent({
						res,
						component: routesEntry,
						cookies: req.cookies,
					});
				}

				const data = await getVariationData(routesEntry, decodeURI(variation));

				if (!data) {
					return `No mock data found for component "${file}", variant "${variation}".`;
				}

				if (embedded) {
					return await render.renderIframeVariation({
						res,
						component: routesEntry,
						variation,
						cookies: req.cookies,
						data,
					});
				}

				if (data.messages.length) {
					for (const { type, text, verbose } of data.messages) {
						log(type, text, verbose);
					}
				}

				return await render.renderIframeVariationStandalone({
					res,
					component: routesEntry,
					componentData: data.resolved,
					cookies: req.cookies,
				});
			}

			case "docs": {
				return await render.renderIframeDocs({
					res,
					doc: routesEntry,
					cookies: req.cookies,
				});
			}

			default:
				res.redirect(302, global.config.indexPath.default);
		}
	});

	global.app.get("/", async (req, res) => {
		await render.renderMainIndex({ res, cookies: req.cookies });
	});

	global.app.all("*splat", async (req, res) => {
		res.sendStatus(404);
	});
}
