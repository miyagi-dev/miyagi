import config from "../../../../default-config.js";
import { getUserUiConfig, getThemeMode } from "../../../helpers.js";
import { getSpacings, getMediaQueries } from "../../../../styleguide/index.js";

export default async function ({ res, cb, cookies }) {
	const spacings = global.state.css
		? getSpacings(
				global.state.css,
				global.config.assets.customProperties.prefixes.spacing,
			)
		: [];
	const mediaQueries = global.state.css
		? getMediaQueries(global.state.css)
		: [];
	const themeMode = getThemeMode(cookies);

	await res.render(
		"design-tokens/sizes.twig.miyagi",
		{
			additionalCssFiles: global.config.assets?.customProperties?.files || [],
			isBuild: global.config.isBuild,
			lang: global.config.ui.lang,
			mediaQueries,
			miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
			spacings: spacings.length > 0 ? spacings : null,
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
