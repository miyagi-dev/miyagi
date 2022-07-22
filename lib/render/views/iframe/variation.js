const path = require("path");
const jsonToYaml = require("js-yaml");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const validateMocks = require("../../../validator/mocks.js");
const { getVariationData } = require("../../../mocks");
const log = require("../../../logger.js");
const { getThemeMode, getComponentTextDirection } = require("../../helpers");

const { getDataForRenderFunction } = require("../../helpers.js");

/**
 * @param {object} object - parameter object
 * @param {object} object.app - the express instance
 * @param {object} [object.res] - the express response object
 * @param {string} object.file - the component path
 * @param {string} [object.variation] - the variation name
 * @param {boolean} [object.embedded] - defines if the component is rendered inside an iframe or not
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 * @returns {Promise} gets resolved when the variation has been rendered
 */
module.exports = async function renderIframeVariation({
	app,
	res,
	file,
	variation,
	embedded,
	cb,
	cookies,
}) {
	const directoryPath = file;
	file = helpers.getTemplateFilePathFromDirectoryPath(app, file);
	const data = await getVariationData(app, file, decodeURI(variation));
	const rawComponentData = (data && data.raw) ?? null;
	const componentData = (data && data.extended) ?? null;
	const themeMode = getThemeMode(app, cookies);
	const componentTextDirection = getComponentTextDirection(app, cookies);

	const validatedMocks = validateMocks(app, file, [
		{
			data: componentData,
			name: variation,
		},
	]);

	let standaloneUrl;

	if (embedded) {
		if (app.get("config").isBuild) {
			standaloneUrl = `component-${helpers.normalizeString(
				path.dirname(file)
			)}-variation-${helpers.normalizeString(variation)}.html`;
		} else {
			standaloneUrl = `/component?file=${path.dirname(
				file
			)}&variation=${encodeURIComponent(variation)}`;
		}
	} else {
		standaloneUrl = null;
	}

	const mockValidation =
		Array.isArray(validatedMocks) && validatedMocks[0]
			? {
					valid: validatedMocks[0],
					copy: config.messages.validator.mocks[
						validatedMocks[0] ? "valid" : "invalid"
					],
			  }
			: null;

	const fileContents = {
		mocks: {
			type: app.get("config").files.mocks.extension[0],
		},
	};

	return new Promise((resolve, reject) => {
		app.render(
			file,
			getDataForRenderFunction(app, componentData),
			async (error, result) => {
				if (error) {
					if (app.get("config").isBuild) {
						if (cb) {
							cb(error);
						}
					} else {
						reject(error);
					}
				} else if (res) {
					const { ui } = app.get("config");
					const componentsEntry = app
						.get("state")
						.components.find(({ shortPath }) => shortPath === directoryPath);

					await res.render(
						standaloneUrl
							? "iframe_component_variation.twig"
							: "component_variation.twig",
						{
							namespaces: {
								miyagi: path.join(__dirname, "../../../../frontend/views"),
							},
							html: result,
							error: typeof result !== "string" ? result : error,
							cssFiles: app.get("config").assets.css,
							jsFilesHead: app
								.get("config")
								.assets.js.filter(
									(entry) => entry.position === "head" || !entry.position
								),
							jsFilesBody: app
								.get("config")
								.assets.js.filter((entry) => entry.position === "body"),
							assets: {
								css: componentsEntry
									? componentsEntry.assets.css
										? path.join("/", componentsEntry.assets.css)
										: false
									: false,
								js: componentsEntry
									? componentsEntry.assets.js
										? path.join("/", componentsEntry.assets.js)
										: false
									: false,
							},
							htmlValidation: Boolean(ui.validations.html),
							accessibilityValidation: Boolean(
								standaloneUrl && ui.validations.accessibility
							),
							standalone: !standaloneUrl,
							standaloneUrl,
							dev: process.env.NODE_ENV === "development",
							prod: process.env.NODE_ENV === "production",
							projectName: config.projectName,
							userProjectName: app.get("config").projectName,
							isBuild: app.get("config").isBuild,
							theme: themeMode
								? Object.assign(app.get("config").ui.theme, { mode: themeMode })
								: app.get("config").ui.theme,
							mockData: ["yaml", "yml"].includes(
								app.get("config").files.mocks.extension[0]
							)
								? jsonToYaml.dump(rawComponentData)
								: JSON.stringify(rawComponentData, null, 2),
							variation,
							normalizedVariation: helpers.normalizeString(variation),
							mockValidation,
							mocks: fileContents.mocks,
							componentTextDirection:
								componentTextDirection ||
								app.get("config").components.textDirection,
							uiTextDirection: app.get("config").ui.textDirection,
							componentLanguage: app.get("config").components.lang,
						},
						(err, html) => {
							if (res.send) {
								if (err) {
									res.send(err.message || err);
								} else {
									res.send(html);
								}
							}

							if (cb) {
								cb(err, html);
							}
						}
					);

					resolve();
				} else {
					resolve(result);
				}
			}
		);
	});
};
