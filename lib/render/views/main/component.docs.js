const path = require("path");
const config = require("../../../config.json");
const { getThemeMode, getComponentTextDirection } = require("../../helpers");

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {object} object.component
 * @param {string} [object.buildDate] - the build date in machine readable format
 * @param {string} [object.formattedBuildDate] - the build date in human readable format
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 */
module.exports = async function renderMainComponentDocs({
	res,
	component,
	buildDate,
	formattedBuildDate,
	cb,
	cookies,
}) {
	const iframeSrc = component.route.embedded;
	const themeMode = getThemeMode(cookies);
	const componentTextDirection = getComponentTextDirection(cookies);
	const hideTests = true;

	await res.render(
		"main.twig",
		{
			namespaces: {
				miyagi: path.join(__dirname, "../../../../frontend/views"),
			},
			folders: global.state.menu,
			components: global.state.components,
			flatUrlPattern: global.config.isBuild
				? "/show-{{component}}.html"
				: "/show?file={{component}}",
			iframeSrc,
			requestedComponent: component.paths.dir.short,
			hideTests,
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
			buildDate,
			formattedBuildDate,
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
