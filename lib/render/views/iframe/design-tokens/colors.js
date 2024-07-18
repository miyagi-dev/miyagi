import path from "node:path";

import config from "../../../../default-config.js";
import { getThemeMode } from "../../../helpers.js";
import { getColors, getMediaQueries } from "../../../../styleguide/index.js";

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
		"design-tokens/colors.twig",
		{
			additionalCssFiles: global.config.assets?.customProperties?.files || [],
			colors:
				colors.map(({ styles }) => styles.length).reduce((a, b) => a + b, 0) > 0
					? colors
					: [],
			isBuild: global.config.isBuild,
			lang: global.config.ui.lang,
			mediaQueries,
			miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
			namespaces: {
				miyagi: path.join(import.meta.dirname, "../../../../../frontend/views"),
			},
			projectName: config.projectName,
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
