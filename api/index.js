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
			global.app = await init("api");
			const file = getTemplateFilePathFromDirectoryPath(component);
			const data = await getVariationData(file, variant);

			if (!data) {
				return {
					success: false,
					message: `No mock data found for component "${component}", variant "${variant}"`,
				};
			}

			const result = await resolveVariationData(data.extended);

			if (!result || !result.resolved) {
				return {
					success: false,
					message: "Unknown error occured",
				};
			}

			return { success: true, data: result.resolved };
		},

		getHtml: async ({ component, variant = "default" }) => {
			global.app = await init("api");

			try {
				const result = await renderIframeVariation({
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
			global.app = await init("build");

			try {
				await build();

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
			if (!component) {
				return {
					success: false,
					message: config.messages.dataGenerator.noComponentFolderDefined,
				};
			}

			try {
				await generateMockData(
					path.join(global.config.components.folder, component),
					global.config.files
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
			global.app = await init("api");
			const components = Object.keys(global.state.partials).map((partial) =>
				getDirectoryPathFromFullTemplateFilePath(partial)
			);
			const promises = [];
			const results = [];

			components.forEach(async (component) => {
				results.push({
					component,
				});

				promises.push(
					new Promise((resolve) => {
						const templateFilePath =
							getTemplateFilePathFromDirectoryPath(component);

						getComponentData(templateFilePath).then((data) => {
							const validation = validateMockData(templateFilePath, data, true);

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
			global.app = await init("api");
			const templateFilePath = getTemplateFilePathFromDirectoryPath(component);
			const data = await getComponentData(templateFilePath);

			return validateMockData(templateFilePath, data, true);
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
