const path = require("path");
const config = require("../../../config.json");
const { getThemeMode, getComponentTextDirection } = require("../../helpers");

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {Function} [object.cb] - callback function
 * @param {string} object.type
 * @param {object} object.cookies
 */
module.exports = function renderMainDesignTokens({ res, cb, cookies, type }) {
	if (!["colors", "sizes", "typography"].includes(type)) return;

	const themeMode = getThemeMode(cookies);
	const componentTextDirection = getComponentTextDirection(cookies);

	res.render(
		"main.twig",
		{
			lang: global.config.ui.lang,
			namespaces: {
				miyagi: path.join(__dirname, "../../../../frontend/views"),
			},
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
