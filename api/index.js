const path = require("path");
const { JSDOM } = require("jsdom");
const init = require("../lib");
const { t } = require("../lib/i18n");
const {
	getComponentData,
	getVariationData,
	resolveVariationData,
} = require("../lib/mocks");
const renderIframeVariation = require("../lib/render/views/iframe/variation.js");
const build = require("../lib/build");
const generateMockData = require("../lib/generator/mocks");
const generateComponent = require("../lib/generator/component");
const validateMockData = require("../lib/validator/mocks");

module.exports = function Api() {
	process.env.MIYAGI_JS_API = true;

	return {
		getMockData: async ({ component, variant = "default" }) => {
			global.app = await init("api");
			const data = await getVariationData(component, variant);

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
			global.app = await init("api", { isBuild: true });

			try {
				const result = await build();

				return {
					success: true,
					message: result,
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
					message: t("dataGenerator.noComponentFolderDefined"),
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

		createComponent: async ({ component, fileTypes }) => {
			global.app = await init("api");

			try {
				const result = await generateComponent({ component, fileTypes });

				return {
					success: true,
					message: result,
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
			const promises = [];

			global.state.routes.forEach((route) => {
				if (route.paths.tpl) {
					promises.push(
						new Promise((resolve) => {
							getComponentData(route).then((data) => {
								if (data) {
									const validation = validateMockData(route, data, true);

									resolve({
										component: route.alias,
										errors: validation,
									});
								} else {
									resolve();
								}
							});
						})
					);
				}
			});

			return await Promise.all(promises).then((res) => {
				return res.filter((result) => result?.errors?.length > 0);
			});
		},

		lintComponent: async ({ component }) => {
			global.app = await init("api");

			const componentObject = global.state.routes.find(({ route }) => {
				return (
					route ===
					path.join(
						"components",
						path.relative(global.config.components.folder, component)
					)
				);
			});

			const data = await getComponentData(componentObject);

			return validateMockData(componentObject, data, true);
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
