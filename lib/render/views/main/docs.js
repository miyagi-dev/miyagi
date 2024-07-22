import path from "path";
import config from "../../../default-config.js";
import { getThemeMode, getComponentTextDirection } from "../../helpers.js";

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {object} object.doc
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 */
export default async function renderMainDocs({ res, doc, cb, cookies }) {
	const themeMode = getThemeMode(cookies);
	const componentTextDirection = getComponentTextDirection(cookies);

	await res.render(
		"main.twig",
		{
			lang: global.config.ui.lang,
			namespaces: {
				miyagi: path.join(import.meta.dirname, "../../../../frontend/views"),
			},
			folders: global.state.menu,
			components: global.state.components,
			flatUrlPattern: global.config.isBuild
				? "/show-{{component}}.html"
				: "/show?file={{component}}",
			iframeSrc: doc.route.embedded,
			requestedComponent: doc.paths.dir.short,
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
