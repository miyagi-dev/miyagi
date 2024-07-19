const path = require("path");
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
			const data = await getVariationData(
				global.state.routes.find(
					(route) =>
						route.paths.dir.short ===
						path.join(
							path.basename(global.config.components.folder),
							component,
						),
				),
				variant,
			);

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
					component: global.state.routes.find(
						(route) =>
							route.paths.dir.short ===
							path.join(
								path.basename(global.config.components.folder),
								component,
							),
					),
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
				global.app = await init("api");

				await generateMockData(
					path.join(global.config.components.folder, component),
					global.config.files,
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

		createComponent: async ({ component, fileTypes = [] }) => {
			global.app = await init("api");

			try {
				const result = await generateComponent({
					component,
					fileTypes:
						fileTypes.length === 0
							? ["css", "docs", "js", "mocks", "schema", "tpl"]
							: fileTypes,
				});

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
						}),
					);
				}
			});

			return await Promise.all(promises).then((res) => {
				return res.filter((result) => result?.errors?.length > 0);
			});
		},

		lintComponent: async ({ component }) => {
			global.app = await init("api");

			const componentObject = global.state.routes.find(
				(route) =>
					route.paths.dir.short ===
					path.join(path.basename(global.config.components.folder), component),
			);

			const data = await getComponentData(componentObject);

			return validateMockData(componentObject, data, true);
		},
	};
};
