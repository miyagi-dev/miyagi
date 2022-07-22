const path = require("path");
const { JSDOM } = require("jsdom");
const init = require("../lib");
const config = require("../lib/config.json");
const {
	getComponentData,
	getVariationData,
	resolveVariationData,
} = require("../lib/mocks");
const renderIframeVariation = require("../lib/render/views/iframe/variation.js");
const {
	getDirectoryPathFromFullTemplateFilePath,
	getTemplateFilePathFromDirectoryPath,
} = require("../lib/helpers");
const build = require("../lib/build");
const generateMockData = require("../lib/generator/mocks");
const validateMockData = require("../lib/validator/mocks");

module.exports = function Api() {
	process.env.MIYAGI_JS_API = true;

	return {
		getMockData: async ({ component, variant = "default" }) => {
			const app = await init("api");
			const file = getTemplateFilePathFromDirectoryPath(app, component);
			const data = await getVariationData(app, file, variant);

			if (!data) {
				return {
					success: false,
					message: `No mock data found for component "${component}", variant "${variant}"`,
				};
			}

			const result = await resolveVariationData(app, data.extended);

			if (!result || !result.resolved) {
				return {
					success: false,
					message: "Unknown error occured",
				};
			}

			return { success: true, data: result.resolved };
		},

		getHtml: async ({ component, variant = "default" }) => {
			const app = await init("api");

			try {
				const result = await renderIframeVariation({
					app,
					file: component,
					variation: variant,
				});

				return {
					success: true,
					data: result,
				};
			} catch (message) {
				return {
					success: false,
					message,
				};
			}
		},

		getNode: async ({ component, variant = "default" }) => {
			try {
				const result = await Api().getHtml({
					component,
					variant,
				});

				if (result && result.success) {
					return {
						success: true,
						data: createElementFromHTML(result.data),
					};
				} else {
					return result;
				}
			} catch (message) {
				return {
					success: false,
					message,
				};
			}
		},

		createBuild: async () => {
			const app = await init("build");

			try {
				await build(app);

				return {
					success: true,
				};
			} catch (message) {
				return {
					success: false,
					message,
				};
			}
		},

		createMockData: async ({ component }) => {
			const app = await init("api");

			if (!component) {
				return {
					success: false,
					message: config.messages.dataGenerator.noComponentFolderDefined,
				};
			}

			try {
				await generateMockData(
					path.join(app.get("config").components.folder, component),
					app.get("config").files
				);

				return {
					success: true,
				};
			} catch (message) {
				return {
					success: false,
					message,
				};
			}
		},

		lintComponents: async () => {
			const app = await init("api");
			const components = Object.keys(app.get("state").partials).map((partial) =>
				getDirectoryPathFromFullTemplateFilePath(app, partial)
			);
			const promises = [];
			const results = [];

			components.forEach(async (component) => {
				results.push({
					component,
				});

				promises.push(
					new Promise((resolve) => {
						const templateFilePath = getTemplateFilePathFromDirectoryPath(
							app,
							component
						);

						getComponentData(app, templateFilePath).then((data) => {
							const validation = validateMockData(
								app,
								templateFilePath,
								data,
								true
							);

							results.find((result) => result.component === component).errors =
								validation;

							resolve();
						});
					})
				);
			});

			return await Promise.all(promises).then(() =>
				results.filter((result) => result.errors?.length > 0)
			);
		},

		lintComponent: async ({ component }) => {
			const app = await init("api");
			const templateFilePath = getTemplateFilePathFromDirectoryPath(
				app,
				component
			);
			const data = await getComponentData(app, templateFilePath);

			return validateMockData(app, templateFilePath, data, true);
		},
	};
};

/**
 * @param {string} html
 * @returns {HTMLElement}
 */
function createElementFromHTML(html) {
	const { document } = new JSDOM().window;
	const div = document.createElement("div");

	div.innerHTML = html.trim();

	if (div.childElementCount > 1) {
		return div;
	}

	return div.firstElementChild;
}
