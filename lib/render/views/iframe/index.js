const path = require("path");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const { getThemeMode } = require("../../helpers.js");
const {
	getColors,
	getFonts,
	getSpacings,
	getMediaQueries,
} = require("../../../styleguide/index.js");

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

	const colors = global.state.css
		? getColors(
				global.state.css,
				global.config.assets.customProperties.prefixes.color
		  )
		: [];
	const fonts = global.state.css
		? getFonts(
				global.state.css,
				global.config.assets.customProperties.prefixes.typo
		  )
		: [];
	const spacings = global.state.css
		? getSpacings(
				global.state.css,
				global.config.assets.customProperties.prefixes.spacing
		  )
		: [];
	const mediaQueries = global.state.css
		? getMediaQueries(global.state.css)
		: [];

	const additionalCssFiles =
		global.config.assets?.customProperties?.files || [];

	await res.render(
		"iframe_index.twig",
		{
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
			colors:
				colors.map(({ styles }) => styles.length).reduce((a, b) => a + b, 0) > 0
					? colors
					: [],
			fonts: fonts.length > 0 ? fonts : null,
			spacings: spacings.length > 0 ? spacings : null,
			mediaQueries,
			additionalCssFiles,
			uiTextDirection: global.config.ui.textDirection,
		},
		(err, html) => {
			if (res.send) {
				if (err) {
					res.send(err);
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
