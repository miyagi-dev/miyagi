const path = require("path");
const jsonToYaml = require("js-yaml");
const config = require("../../../config.json");
const { t } = require("../../../i18n");
const helpers = require("../../../helpers.js");
const validateMocks = require("../../../validator/mocks.js");
const { getVariationData } = require("../../../mocks");
const { getThemeMode, getComponentTextDirection } = require("../../helpers");

const { getDataForRenderFunction } = require("../../helpers.js");

/**
 * @param {object} object - parameter object
 * @param {object} [object.res] - the express response object
 * @param {object} object.component
 * @param {string} [object.variation] - the variation name
 * @param {boolean} [object.embedded] - defines if the component is rendered inside an iframe or not
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 * @returns {Promise} gets resolved when the variation has been rendered
 */
module.exports = async function renderIframeVariation({
	res,
	component,
	variation,
	embedded,
	cb,
	cookies,
}) {
	const directoryPath = component.paths.dir.short;
	const data = await getVariationData(component, decodeURI(variation));
	const rawComponentData = (data && data.raw) ?? null;
	const componentData = (data && data.extended) ?? null;
	const themeMode = getThemeMode(cookies);
	const componentTextDirection = getComponentTextDirection(cookies);

	const validatedMocks = validateMocks(component, [
		{
			data: componentData,
			name: variation,
		},
	]);

	let standaloneUrl;

	if (embedded) {
		if (global.config.isBuild) {
			standaloneUrl = `component-${helpers.normalizeString(
				path.dirname(component.paths.tpl.short),
			)}-variation-${helpers.normalizeString(variation)}.html`;
		} else {
			standaloneUrl = `/component?file=${path.dirname(
				component.paths.tpl.short,
			)}&variation=${encodeURIComponent(variation)}`;
		}
	} else {
		standaloneUrl = null;
	}

	const mockValidation = validatedMocks
		? {
				valid: validatedMocks.length === 0,
				copy: t(
					`validator.mocks.${validatedMocks.length === 0 ? "valid" : "invalid"}`,
				),
			}
		: null;
	const fileContents = {
		mocks: {
			type: global.config.files.mocks.extension[0],
		},
	};

	return new Promise((resolve) => {
		global.app.render(
			component.paths.tpl.full,
			getDataForRenderFunction(componentData),
			async (result) => {
				if (res) {
					const componentsEntry = global.state.components.find(
						({ shortPath }) => shortPath === directoryPath,
					);

					await res.render(
						standaloneUrl
							? "iframe_component_variation.twig"
							: "component_variation.twig",
						{
							namespaces: {
								miyagi: path.join(__dirname, "../../../../frontend/views"),
							},
							html: result,
							cssFiles: global.config.assets.css,
							jsFilesHead: global.config.assets.js.filter(
								(entry) => entry.position === "head" || !entry.position,
							),
							jsFilesBody: global.config.assets.js.filter(
								(entry) => entry.position === "body",
							),
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
							standalone: !standaloneUrl,
							standaloneUrl,
							miyagiDev: !!process.env.MIYAGI_DEVELOPMENT,
							dev: process.env.NODE_ENV === "development",
							prod: process.env.NODE_ENV === "production",
							projectName: config.projectName,
							userProjectName: global.config.projectName,
							isBuild: global.config.isBuild,
							theme: themeMode
								? Object.assign(global.config.ui.theme, { mode: themeMode })
								: global.config.ui.theme,
							mockData: ["yaml", "yml"].includes(
								global.config.files.mocks.extension[0],
							)
								? jsonToYaml.dump(rawComponentData)
								: JSON.stringify(rawComponentData, null, 2),
							variation,
							normalizedVariation: helpers.normalizeString(variation),
							mockValidation,
							mocks: fileContents.mocks,
							componentTextDirection:
								componentTextDirection ||
								global.config.components.textDirection,
							uiTextDirection: global.config.ui.textDirection,
							componentLanguage: global.config.components.lang,
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

					resolve();
				} else {
					resolve(result);
				}
			},
		);
	});
};
