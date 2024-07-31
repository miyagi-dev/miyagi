import path from "path";
import config from "../../../default-config.js";
import { getThemeMode, getComponentTextDirection } from "../../helpers.js";

/**
 * @param {object} object - parameter object
 * @param {object} [object.res] - the express response object
 * @param {object} object.component
 * @param {object} object.componentData
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 * @returns {Promise} gets resolved when the variation has been rendered
 */
export default async function renderIframeVariationStandalone({
	res,
	component,
	componentData,
	cb,
	cookies,
}) {
	const directoryPath = component.paths.dir.short;
	const themeMode = getThemeMode(cookies);
	const componentTextDirection = getComponentTextDirection(cookies);

	return new Promise((resolve, reject) => {
		global.app.render(
			component.paths.tpl.full,
			componentData ?? {},
			async (error, result) => {
				if (error) {
					if (global.config.isBuild) {
						if (cb) {
							cb(error);
						}
					} else {
						reject(error);
					}
				} else if (res) {
					const componentsEntry = global.state.components.find(
						({ shortPath }) => shortPath === directoryPath,
					);

					await res.render(
						"component_variation.twig.miyagi",
						{
							html: result,
							cssFiles: global.config.assets.css,
							jsFilesHead: global.config.assets.js.filter(
								(entry) => entry.position === "head" || !entry.position,
							),
							jsFilesBody: global.config.assets.js.filter(
								(entry) => entry.position === "body",
							),
							assets: {
								css: componentsEntry
									? componentsEntry.assets.css
										? path.join("/", componentsEntry.assets.css)
										: false
									: false,
								js: componentsEntry
									? componentsEntry.assets.js
										? path.join("/", componentsEntry.assets.js)
										: false
									: false,
							},
							miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
							prod: process.env.NODE_ENV === "production",
							projectName: config.projectName,
							isBuild: global.config.isBuild,
							theme: themeMode
								? Object.assign(global.config.ui.theme, { mode: themeMode })
								: global.config.ui.theme,
							componentTextDirection:
								componentTextDirection ||
								global.config.components.textDirection,
							componentLanguage: global.config.components.lang,
						},
						(html) => {
							if (res.send) {
								res.send(html);
							}

							if (cb) {
								cb(null, html);
							}
						},
					);

					resolve();
				} else {
					resolve(result);
				}
			},
		);
	});
}
