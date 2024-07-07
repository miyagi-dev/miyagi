const path = require("path");
const config = require("../../../config.json");
const { getThemeMode, getComponentTextDirection } = require("../../helpers");

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {object} object.doc
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 */
module.exports = async function renderIframeDocs({ res, doc, cb, cookies }) {
	const fullPath = doc.paths.dir.full;
	const shortPath = doc.paths.dir.short;
	const componentDocumentation = global.state.fileContents[fullPath];
	const componentName = getHeadlineFromFileName(shortPath);
	const themeMode = getThemeMode(cookies);
	const componentTextDirection = getComponentTextDirection(cookies);

	await res.render(
		"iframe_component.twig",
		{
			lang: global.config.ui.lang,
			namespaces: {
				miyagi: path.join(__dirname, "../../../../frontend/views"),
			},
			miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
			dev: process.env.NODE_ENV === "development",
			prod: process.env.NODE_ENV === "production",
			projectName: config.projectName,
			userProjectName: global.config.projectName,
			isBuild: global.config.isBuild,
			theme: themeMode
				? Object.assign(global.config.ui.theme, { mode: themeMode })
				: global.config.ui.theme,
			documentation: componentDocumentation,
			name: componentDocumentation?.includes("<h1") ? null : componentName,
			componentTextDirection:
				componentTextDirection || global.config.components.textDirection,
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
		},
	);
};

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
