const anymatch = require("anymatch");
const path = require("path");
const jsonToYaml = require("js-yaml");
const config = require("../../../config.json");
const helpers = require("../../../helpers.js");
const validateMocks = require("../../../validator/mocks.js");
const { getVariationData, getComponentData } = require("../../../mocks");
const {
	getDataForRenderFunction,
	getThemeMode,
	getComponentTextDirection,
} = require("../../helpers");
const log = require("../../../logger.js");

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {string} object.file - the component path
 * @param {Function} [object.cb] - callback function
 * @param {object} object.cookies
 * @param {boolean} object.noCli
 */
module.exports = async function renderIframeComponent({
	res,
	file,
	cb,
	cookies,
	noCli,
}) {
	file = helpers.getTemplateFilePathFromDirectoryPath(file);
	const templateFilePath = helpers.getFullPathFromShortPath(file);
	const hasTemplate = Object.values(global.state.partials).includes(
		templateFilePath
	);

	const componentJson = await getComponentData(file);
	const componentDocumentation =
		global.state.fileContents[
			helpers.getDocumentationPathFromTemplatePath(templateFilePath)
		];
	const schemaFilePath =
		helpers.getSchemaPathFromTemplatePath(templateFilePath);
	const componentSchema = global.state.fileContents[schemaFilePath];
	const componentTemplate = global.state.fileContents[templateFilePath];

	let mockFilePath;

	const defaultMockDataPath = helpers.getDataPathFromTemplatePath(
		templateFilePath,
		global.config.files.mocks.extension[0]
	);
	const jsMockDataPath = helpers.getDataPathFromTemplatePath(
		templateFilePath,
		global.config.files.mocks.extension[1]
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
						helpers.getShortPathFromFullPath(schemaFilePath)
					),
			  }
			: null,
		mocks: componentMocks
			? {
					string: componentMocksString,
					type: global.config.files.mocks.extension[0],
					file: path.join(
						global.config.components.folder,
						helpers.getShortPathFromFullPath(mockFilePath)
					),
			  }
			: null,
		template: componentTemplate
			? {
					string: componentTemplate,
					type: global.config.engine.name,
					file: path.join(
						global.config.components.folder,
						helpers.getShortPathFromFullPath(templateFilePath)
					),
			  }
			: null,
	};

	let componentName = path.basename(path.dirname(file));

	let context;

	if (componentJson.length > 0) {
		context = componentJson.filter((entry) => entry !== null);
	} else {
		const componentData = hasTemplate
			? await getVariationData(file)
			: { raw: {}, extended: {} };

		context = [];

		if (componentData) {
			context.push({
				component: file,
				data: componentData.extended,
				rawData: componentData.raw,
				name: config.defaultVariationName,
			});
		}
	}

	await renderVariations({
		res,
		file,
		context,
		componentDocumentation,
		fileContents,
		name: componentName,
		cb,
		templateFilePath: hasTemplate ? templateFilePath : null,
		cookies,
		noCli,
	});
};

/**
 * @typedef {object} FileContents
 * @property {object} schema - schema object
 * @property {string} schema.string - string with schema
 * @property {("yaml"|"yml"|"json")} schema.type - the file type of the schema file
 * @property {boolean} schema.selected - true if the schema tab should initially be visible
 * @property {string} schema.file - the schema file path
 * @property {object} mocks - mocks object
 * @property {string} mocks.string - string with mocks
 * @property {("yaml"|"yml"|"js"|"json")} mocks.type - the file type of the mocks file
 * @property {boolean} mocks.selected - true if the mocks tab should initially be visible
 * @property {string} mocks.file - the mock file path
 * @property {object} template - template object
 * @property {string} template.string - string with template
 * @property {string} template.type - the file type of the template file
 * @property {boolean} template.selected - true if the template tab should initially be visible
 * @property {string} template.file - the template file path
 */

/**
 * @param {object} object - parameter object
 * @param {object} object.res - the express response object
 * @param {string} object.file - short component path
 * @param {Array} object.context - mock data for each variation
 * @param {string} object.componentDocumentation - html string with documentation
 * @param {FileContents} object.fileContents - file contents object
 * @param {string} object.name - component name
 * @param {Function} object.cb - callback function
 * @param {string} object.templateFilePath - the absolute component file path
 * @param {object} object.cookies
 * @param {boolean} object.noCli
 * @returns {Promise}
 */
async function renderVariations({
	res,
	file,
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
	const validatedMocks = validateMocks(file, context, noCli);
	const baseName = path.dirname(file);
	const renderInIframe = getRenderInIframe(
		baseName,
		global.config.components.renderInIframe
	);

	if (templateFilePath) {
		if (context.length > 0) {
			for (let i = 0, len = context.length; i < len; i += 1) {
				const entry = context[i];

				variations[i] = getData(
					context[i].name,
					file,
					baseName,
					entry,
					validatedMocks
				);

				if (!renderInIframe) {
					promises.push(
						new Promise((resolve, reject) => {
							global.app.render(
								templateFilePath,
								getDataForRenderFunction(entry.data),
								(err, result) => {
									if (err) {
										if (typeof err === "string") {
											log("error", err);
										} else if (err.message) {
											log("error", err.message);
											err = err.message;
										}

										if (global.config.isBuild) {
											reject();
										}
									}

									variations[i].html = result;
									variations[i].error = err;

									resolve(result);
								}
							);
						})
					);
				}
			}
		} else {
			if (!renderInIframe) {
				promises.push(
					new Promise((resolve, reject) => {
						global.app.render(
							templateFilePath,
							getDataForRenderFunction({}),
							(err, result) => {
								if (err) {
									if (typeof err === "string") {
										log("error", err);
									} else if (err.message) {
										log("error", err.message);
										err = err.message;
									}

									if (global.config.isBuild) {
										reject();
									}
								}

								variations[0] = {
									...getData("default", file, baseName, {}, [], 0),
									html: result,
									error: err,
								};

								resolve(result);
							}
						);
					})
				);
			}
		}
	} else {
		promises.push(Promise.resolve());
	}

	return Promise.all(promises)
		.then(async () => {
			const { ui } = global.config;
			const themeMode = getThemeMode(cookies);
			const componentTextDirection = getComponentTextDirection(cookies);
			const renderFileTabs = !!(
				fileContents.schema ||
				fileContents.mocks ||
				fileContents.template
			);
			const componentsEntry = global.state.components.find(
				({ shortPath }) => shortPath === baseName
			);

			await res.render(
				"iframe_component.twig",
				{
					namespaces: {
						miyagi: path.join(__dirname, "../../../../frontend/views"),
					},
					variations,
					cssFiles: global.config.assets.css,
					jsFilesHead: global.config.assets.js.filter(
						(entry) => entry.position === "head" || !entry.position
					),
					jsFilesBody: global.config.assets.js.filter(
						(entry) => entry.position === "body"
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
					renderInIframe,
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
					schema: fileContents.schema,
					schemaError:
						validatedMocks?.length > 0 && validatedMocks[0].type === "schema"
							? validatedMocks[0].data.map((error) => error.message).join("\n")
							: null,
					mocks: fileContents.mocks,
					template: fileContents.template,
					renderInformation: renderFileTabs || variations.length > 0,
					renderFileTabs,
					folder: path.join(
						global.config.components.folder,
						file.split(path.sep).slice(0, -1).join("/")
					),
					name: componentDocumentation?.includes("<h1>") ? null : name,
					componentTextDirection:
						componentTextDirection || global.config.components.textDirection,
					uiTextDirection: global.config.ui.textDirection,
					componentLanguage: global.config.components.lang,
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
		})
		.catch(() => {
			if (cb) {
				cb(true);
			}
		});
}

/**
 * @param {string} baseName
 * @param {object} object
 * @param {boolean} object.default
 * @param {Array} object.except
 * @returns {boolean}
 */
function getRenderInIframe(
	baseName,
	{ default: byDefaultRenderInIframe, except }
) {
	if (byDefaultRenderInIframe) {
		return !anymatch(except, baseName);
	}

	return anymatch(except, baseName);
}

/**
 * @param {string} variation
 * @param {string} file
 * @param {string} baseName
 * @param {object} entry
 * @param {Array} validatedMocks
 * @returns {object}
 */
function getData(variation, file, baseName, entry, validatedMocks) {
	let standaloneUrl;

	if (global.config.isBuild) {
		standaloneUrl = `component-${helpers.normalizeString(
			path.dirname(file)
		)}-variation-${helpers.normalizeString(variation)}.html`;
	} else {
		standaloneUrl = `/component?file=${path.dirname(
			file
		)}&variation=${encodeURIComponent(variation)}`;
	}

	const data = {
		url: global.config.isBuild
			? `component-${helpers.normalizeString(
					baseName
			  )}-variation-${helpers.normalizeString(variation)}-embedded.html`
			: `/component?file=${baseName}&variation=${variation}&embedded=true`,
		file,
		variation,
		normalizedVariation: helpers.normalizeString(variation),
		standaloneUrl,
		mockData: ["yaml", "yml"].includes(global.config.files.mocks.extension[0])
			? jsonToYaml.dump(entry.rawData)
			: JSON.stringify(entry.rawData, null, 2),
	};

	const validationEntry = validatedMocks?.find(
		(item) => item.variant === entry.name
	);

	if (validationEntry) {
		data.mockValidation = {
			valid: false,
			copy: config.messages.validator.mocks.invalid,
		};
	} else {
		data.mockValidation = {
			valid: true,
		};
	}

	return data;
}
