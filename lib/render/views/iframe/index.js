const path = require("path");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const { getThemeMode } = require("../../helpers.js");

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 * @returns {Promise}
 */
module.exports = async function renderIframeIndex({ res, cb, cookies }) {
	const documentation =
		global.state.fileContents[helpers.getFullPathFromShortPath("README.md")];

	const { ui } = global.config;
	const themeMode = getThemeMode(cookies);

	await res.render(
		"iframe_index.twig",
		{
			lang: global.config.ui.lang,
			namespaces: {
				miyagi: path.join(__dirname, "../../../../frontend/views"),
			},
			dev: process.env.NODE_ENV === "development",
			prod: process.env.NODE_ENV === "production",
			a11yTestsPreload: ui.validations.accessibility,
			projectName: config.projectName,
			userProjectName: global.config.projectName,
			isBuild: global.config.isBuild,
			theme: themeMode
				? Object.assign(global.config.ui.theme, { mode: themeMode })
				: global.config.ui.theme,
			documentation,
			uiTextDirection: global.config.ui.textDirection,
		},
		(err, html) => {
			if (res.send) {
				if (err) {
					res.send(err.toString());
				} else {
					res.send(html);
				}
			}

			if (cb) {
				cb(err, html);
			}
		}
	);
};
