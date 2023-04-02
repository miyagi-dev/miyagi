const path = require("path");
const tests = require("../../tests.json");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const { getThemeMode, getComponentTextDirection } = require("../../helpers");

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {object} object.component
 * @param {string} [object.variation] - the variation name
 * @param {string} [object.buildDate] - the build date in machine readable format
 * @param {string} [object.formattedBuildDate] - the build date in human readable format
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 */
module.exports = async function renderMainComponent({
	res,
	component,
	variation,
	buildDate,
	formattedBuildDate,
	cb,
	cookies,
}) {
	let iframeSrc = component.route.default;
	const themeMode = getThemeMode(cookies);
	const componentTextDirection = getComponentTextDirection(cookies);
	const hideTests =
		!global.config.ui.validations.accessibility &&
		!global.config.ui.validations.html;

	if (variation) {
		if (global.config.isBuild) {
			iframeSrc = iframeSrc.replace(
				/\.html$/,
				`-variation-${helpers.normalizeString(variation)}.html`
			);
		} else {
			iframeSrc += `&variation=${variation}`;
		}
	}

	if (global.config.isBuild) {
		iframeSrc = iframeSrc.replace(/\.html$/, "-embedded.html");
	} else {
		iframeSrc += "&embedded=true";
	}

	await res.render(
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
			iframeSrc,
			requestedComponent: component.paths.dir.short,
			requestedVariation: variation,
			hideTests,
			tests,
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
