import path from "path";
import config from "../../../default-config.js";
import { getUserUiConfig, getThemeMode } from "../../helpers.js";

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {object} object.component
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 */
export default async function renderIframeComponentDocs({
	res,
	component,
	cb,
	cookies,
}) {
	const componentDocumentation =
		global.state.fileContents[component.paths.docs.full];
	const componentName = getHeadlineFromFileName(
		path.basename(
			component.paths.docs.full,
			path.extname(component.paths.docs.full),
		),
	);
	const themeMode = getThemeMode(cookies);

	await res.render(
		"iframe_component.twig.miyagi",
		{
			lang: global.config.ui.lang,
			miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
			dev: process.env.NODE_ENV === "development",
			prod: process.env.NODE_ENV === "production",
			projectName: config.projectName,
			userProjectName: global.config.projectName,
			isBuild: global.config.isBuild,
			userUiConfig: getUserUiConfig(cookies),
			theme: themeMode
				? Object.assign(global.config.ui.theme, { mode: themeMode })
				: global.config.ui.theme,
			documentation: componentDocumentation,
			name: componentDocumentation?.includes("<h1") ? null : componentName,
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

/**
 * @param {string} file
 * @returns {string}
 */
function getHeadlineFromFileName(file) {
	if (typeof file !== "string") return "";

	let fileName = file;

	if (fileName.startsWith("/")) {
		fileName = fileName.slice(1);
	}

	if (file.endsWith("README.md") || file.endsWith("index.md")) {
		fileName = path.dirname(fileName);
	} else {
		fileName = path.basename(fileName, ".md");
	}

	return fileName.replaceAll("-", " ");
}
