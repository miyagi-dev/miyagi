import config from "../../../default-config.js";
import { getThemeMode, getComponentTextDirection } from "../../helpers.js";

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {Function} [object.cb] - callback function
 * @param {string} object.type
 * @param {object} object.cookies
 */
export default function renderMainDesignTokens({ res, cb, cookies, type }) {
	if (!["colors", "sizes", "typography"].includes(type)) return;

	const themeMode = getThemeMode(cookies);
	const componentTextDirection = getComponentTextDirection(cookies);

	res.render(
		"main.twig.miyagi",
		{
			lang: global.config.ui.lang,
			folders: global.state.menu,
			components: global.state.components,
			flatUrlPattern: global.config.isBuild
				? "/show-{{component}}.html"
				: "/show?file={{component}}",
			iframeSrc: global.config.isBuild
				? `/iframe-design-tokens-${type}.html`
				: `/iframe/design-tokens/${type}`,
			showAll: true,
			projectName: config.projectName,
			userProjectName: global.config.projectName,
			indexPath: global.config.indexPath.embedded,
			miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
			isBuild: global.config.isBuild,
			theme: themeMode
				? Object.assign(global.config.ui.theme, { mode: themeMode })
				: global.config.ui.theme,
			componentTextDirection:
				componentTextDirection || global.config.components.textDirection,
			basePath: global.config.isBuild ? global.config.build.basePath : "/",
			uiTextDirection: global.config.ui.textDirection,
			requestedComponent: "design-tokens",
			requestedVariation: type,
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
