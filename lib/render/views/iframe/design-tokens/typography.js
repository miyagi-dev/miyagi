const path = require("node:path");

const config = require("../../../../config.json");
const { getThemeMode } = require("../../../helpers.js");
const { getTypography, getMediaQueries } = require("../../../../styleguide");

module.exports = async function ({ res, cb, cookies }) {
	const typography = global.state.css
		? getTypography(
				global.state.css,
				global.config.assets.customProperties.prefixes.typo
		  )
		: [];
	const mediaQueries = global.state.css
		? getMediaQueries(global.state.css)
		: [];
	const themeMode = getThemeMode(cookies);

	await res.render(
		"design-tokens/typography.twig",
		{
			additionalCssFiles: global.config.assets?.customProperties?.files || [],
			isBuild: global.config.isBuild,
			lang: global.config.ui.lang,
			mediaQueries,
			miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
			namespaces: {
				miyagi: path.join(__dirname, "../../../../../frontend/views"),
			},
			typography: typography.length > 0 ? typography : null,
			projectName: config.projectName,
			theme: themeMode
				? Object.assign(global.config.ui.theme, { mode: themeMode })
				: global.config.ui.theme,
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
