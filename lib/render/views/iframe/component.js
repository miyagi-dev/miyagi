import path from "path";
import jsonToYaml from "js-yaml";
import config from "../../../default-config.js";
import { t } from "../../../i18n/index.js";
import * as helpers from "../../../helpers.js";
import validateMocks from "../../../validator/mocks.js";
import { getComponentData } from "../../../mocks/index.js";
import { getUserUiConfig, getThemeMode } from "../../helpers.js";
import log from "../../../logger.js";

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {object} object.component
 * @param {Function} [object.cb] - callback function
 * @param {object} [object.cookies]
 * @param {boolean} [object.noCli]
 */
export default async function renderIframeComponent({
	res,
	component,
	cb,
	cookies,
	noCli,
}) {
	const hasTemplate =
		component.paths.tpl &&
		Object.values(global.state.partials).includes(component.paths.tpl.full);
	const componentJson = (await getComponentData(component)) || [];
	const componentDocumentation =
		global.state.fileContents[path.join(component.paths.dir.full, "README.md")];
	const componentSchema =
		global.state.fileContents[component.paths.schema.full];
	const componentTemplate = hasTemplate
		? global.state.fileContents[component.paths.tpl.full]
		: null;

	let mockFilePath;

	const defaultMockDataPath = component.paths.mocks.full(
		global.config.files.mocks.extension[0],
	);
	const jsMockDataPath = component.paths.mocks.full(
		global.config.files.mocks.extension[1],
	);
	const jsMockData = global.state.fileContents[jsMockDataPath];

	if (jsMockData) {
		mockFilePath = jsMockDataPath;
	} else {
		mockFilePath = defaultMockDataPath;
	}

	const componentMocks = global.state.fileContents[mockFilePath];

	let componentSchemaString;
	if (componentSchema) {
		if (["yaml", "yml"].includes(global.config.files.schema.extension)) {
			componentSchemaString = jsonToYaml.dump(componentSchema);
		} else {
			componentSchemaString = JSON.stringify(componentSchema, null, 2);
		}
	}

	let componentMocksString;
	if (componentMocks) {
		if (["yaml", "yml"].includes(global.config.files.mocks.extension[0])) {
			componentMocksString = jsonToYaml.dump(componentMocks);
		} else {
			componentMocksString = JSON.stringify(componentMocks, null, 2);
		}
	}

	const fileContents = {
		schema: componentSchema
			? {
					string: componentSchemaString,
					type: global.config.files.schema.extension,
					file: path.join(
						global.config.components.folder,
						component.paths.schema.short,
					),
				}
			: null,
		mocks: componentMocks
			? {
					string: componentMocksString,
					type: global.config.files.mocks.extension[0],
					file: path.join(
						global.config.components.folder,
						helpers.getShortPathFromFullPath(mockFilePath),
					),
				}
			: null,
		template: componentTemplate
			? {
					string: componentTemplate,
					type: global.config.files.templates.extension,
					file: path.join(
						global.config.components.folder,
						helpers.getShortPathFromFullPath(component.paths.tpl.full),
					),
				}
			: null,
	};

	await renderVariations({
		res,
		component,
		context: componentJson.filter((entry) => entry !== null),
		componentDocumentation,
		fileContents,
		name: component.name,
		cb,
		templateFilePath: hasTemplate ? component.paths.tpl.full : null,
		cookies,
		noCli,
	});
}

/**
 * @typedef {object} FileContents
 * @property {object} schema - schema object
 * @property {string} schema.string - string with schema
 * @property {("yaml"|"yml"|"json")} schema.type - the file type of the schema file
 * @property {boolean} [schema.selected] - true if the schema tab should initially be visible
 * @property {string} schema.file - the schema file path
 * @property {object} mocks - mocks object
 * @property {string} mocks.string - string with mocks
 * @property {("yaml"|"yml"|"js"|"json")} mocks.type - the file type of the mocks file
 * @property {boolean} [mocks.selected] - true if the mocks tab should initially be visible
 * @property {string} mocks.file - the mock file path
 * @property {object} template - template object
 * @property {string} template.string - string with template
 * @property {string} template.type - the file type of the template file
 * @property {boolean} [template.selected] - true if the template tab should initially be visible
 * @property {string} template.file - the template file path
 */

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {object} object.component
 * @param {Array} object.context - mock data for each variation
 * @param {string} object.componentDocumentation - html string with documentation
 * @param {FileContents} object.fileContents - file contents object
 * @param {string} object.name - component name
 * @param {Function} object.cb - callback function
 * @param {string} object.templateFilePath - the absolute component file path
 * @param {object} [object.cookies]
 * @param {boolean} object.noCli
 * @returns {Promise}
 */
async function renderVariations({
	res,
	component,
	context,
	componentDocumentation,
	fileContents,
	name,
	cb,
	templateFilePath,
	cookies,
	noCli,
}) {
	const variations = [];
	const promises = [];
	const validatedMocks = validateMocks(component, context, noCli);

	if (templateFilePath) {
		if (context.length > 0) {
			for (let i = 0, len = context.length; i < len; i += 1) {
				const entry = context[i];

				variations[i] = getData(
					context[i].name,
					component.paths.dir.short,
					entry,
					validatedMocks,
				);
			}
		}
	} else {
		promises.push(Promise.resolve());
	}

	let schemaJson;

	if (fileContents?.schema?.string) {
		try {
			schemaJson = JSON.stringify(jsonToYaml.load(fileContents.schema.string));
		} catch (err) {
			log("error", null, err);
		}
	}

	let mocksJson;

	if (fileContents?.mocks?.string) {
		try {
			mocksJson = JSON.stringify(jsonToYaml.load(fileContents.mocks.string));
		} catch (err) {
			log("error", null, err);
		}
	}

	return Promise.all(promises)
		.then(async () => {
			const themeMode = getThemeMode(cookies);
			const renderFileTabs = !!(
				fileContents.schema ||
				fileContents.mocks ||
				fileContents.template
			);
			const componentsEntry = global.state.components.find(
				({ shortPath }) => shortPath === component.paths.dir.short,
			);

			await res.render(
				"iframe_component.twig.miyagi",
				{
					lang: global.config.ui.lang,
					variations,
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
					schema: schemaJson,
					schemaError:
						validatedMocks?.length > 0 && validatedMocks[0].type === "schema"
							? validatedMocks[0].data.map((error) => error.message).join("\n")
							: null,
					mocks: mocksJson,
					template: fileContents.template,
					renderInformation: renderFileTabs || variations.length > 0,
					renderFileTabs,
					folder: path.relative("components", component.paths.dir.short),
					name: componentDocumentation?.includes("<h1>") ? null : name,
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
		})
		.catch(() => {
			if (cb) {
				cb(true);
			}
		});
}

/**
 * @param {string} variation
 * @param {string} shortPath
 * @param {object} entry
 * @param {Array} validatedMocks
 * @returns {object}
 */
function getData(variation, shortPath, entry, validatedMocks) {
	let standaloneUrl;

	if (global.config.isBuild) {
		standaloneUrl = `component-${helpers.normalizeString(
			shortPath,
		)}-variation-${helpers.normalizeString(variation)}.html`;
	} else {
		standaloneUrl = `/component?file=${shortPath}&variation=${encodeURIComponent(
			variation,
		)}`;
	}

	const data = {
		url: global.config.isBuild
			? `component-${helpers.normalizeString(
					shortPath,
				)}-variation-${helpers.normalizeString(variation)}-embedded.html`
			: `/component?file=${shortPath}&variation=${variation}&embedded=true`,
		file: shortPath,
		variation,
		normalizedVariation: helpers.normalizeString(variation),
		standaloneUrl,
		mockData: JSON.stringify(entry.raw),
		mockDataResolved: JSON.stringify(entry.resolved),
	};

	const validationEntry = validatedMocks?.find(
		(item) => item.variant === entry.name,
	);

	if (validationEntry) {
		data.mockValidation = {
			valid: false,
			copy: t("validator.mocks.invalid"),
		};
	} else {
		data.mockValidation = {
			valid: true,
		};
	}

	return data;
}
