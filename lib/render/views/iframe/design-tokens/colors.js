import config from "../../../../default-config.js";
import { getUserUiConfig, getThemeMode } from "../../../helpers.js";
import { getColors, getMediaQueries } from "../../../../styleguide/index.js";

/**
 * @param {object} o
 * @param {object} o.res
 * @param {Function} [o.cb]
 * @param {object} o.cookies
 */
export default async function ({ res, cb, cookies }) {
	const colors = global.state.css
		? getColors(
				global.state.css,
				global.config.assets.customProperties.prefixes.color,
			)
		: [];
	const mediaQueries = global.state.css
		? getMediaQueries(global.state.css)
		: [];
	const themeMode = getThemeMode(cookies);

	await res.render(
		"design-tokens/colors.twig.miyagi",
		{
			additionalCssFiles: global.config.assets?.customProperties?.files || [],
			colors:
				colors.map(({ styles }) => styles.length).reduce((a, b) => a + b, 0) > 0
					? colors
					: [],
			isBuild: global.config.isBuild,
			lang: global.config.ui.lang,
			mediaQueries,
			miyagiDev: true,
			projectName: config.projectName,
			userUiConfig: getUserUiConfig(cookies),
			theme: themeMode
				? Object.assign(global.config.ui.theme, { mode: themeMode })
				: global.config.ui.theme,
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
