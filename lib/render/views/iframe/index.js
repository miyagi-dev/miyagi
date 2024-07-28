import config from "../../../default-config.js";
import * as helpers from "../../../helpers.js";
import { getThemeMode } from "../../helpers.js";

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 * @returns {Promise}
 */
export default async function renderIframeIndex({ res, cb, cookies }) {
	const documentation =
		global.state.fileContents[helpers.getFullPathFromShortPath("README.md")];

	const themeMode = getThemeMode(cookies);

	await res.render(
		"iframe_index.twig",
		{
			lang: global.config.ui.lang,
			miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
			dev: process.env.NODE_ENV === "development",
			prod: process.env.NODE_ENV === "production",
			projectName: config.projectName,
			userProjectName: global.config.projectName,
			isBuild: global.config.isBuild,
			theme: themeMode
				? Object.assign(global.config.ui.theme, { mode: themeMode })
				: global.config.ui.theme,
			documentation,
			uiTextDirection: global.config.ui.textDirection,
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
}
