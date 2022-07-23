const path = require("path");
const config = require("../../../config.json");
const { getThemeMode, getComponentTextDirection } = require("../../helpers");

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {string} object.file - the component path
 * @param {string} object.fullPath
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 */
module.exports = async function renderIframeDocs({
	res,
	file,
	fullPath,
	cb,
	cookies,
}) {
	const componentDocumentation = global.state.fileContents[fullPath];
	const componentName = getHeadlineFromFileName(file);
	const { ui } = global.config;
	const themeMode = getThemeMode(cookies);
	const componentTextDirection = getComponentTextDirection(cookies);

	await res.render(
		"iframe_component.twig",
		{
			namespaces: {
				miyagi: path.join(__dirname, "../../../../frontend/views"),
			},
			dev: process.env.NODE_ENV === "development",
			prod: process.env.NODE_ENV === "production",
			a11yTestsPreload: ui.validations.accessibility,
			projectName: config.projectName,
			userProjectName: global.config.projectName,
			isBuild: global.config.isBuild,
			theme: themeMode
				? Object.assign(global.config.ui.theme, { mode: themeMode })
				: global.config.ui.theme,
			documentation: componentDocumentation,
			name: componentDocumentation.includes("<h1") ? null : componentName,
			componentTextDirection:
				componentTextDirection || global.config.components.textDirection,
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
