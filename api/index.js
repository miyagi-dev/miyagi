import path from "path";
import init from "../lib/index.js";
import { t } from "../lib/i18n/index.js";
import { getComponentData, getVariationData } from "../lib/mocks/index.js";
import renderIframeVariationStandalone from "../lib/render/views/iframe/variation.standalone.js";
import build from "../lib/build/index.js";
import generateMockData from "../lib/generator/mocks.js";
import generateComponent from "../lib/generator/component.js";
import validateMockData from "../lib/validator/mocks.js";

/**
 * @param {object} obj
 * @param {string|null} obj.component
 * @param {string} [obj.variant]
 * @returns {Promise<object>}
 */
export const getMockData = async (
	{ component, variant = "default" } = { component: null },
) => {
	if (!component)
		return {
			success: false,
			message:
				'Please pass a component to `getMockData` ({ component: "name" }).',
		};

	global.app = await init("api");

	const componentObject = getComponentsObject(component);

	if (!componentObject)
		return {
			success: false,
			message: `Component "${component}" does not exist.`,
		};

	const data = await getVariationData(componentObject, variant);

	if (!data) {
		return {
			success: false,
			message: `No mock data found for component "${component}", variant "${variant}".`,
		};
	}

	if (!data.resolved) {
		return {
			success: false,
			message: "An unknown error occured.",
		};
	}

	return { success: true, data: data.resolved };
};

/**
 * @param {object} obj
 * @param {string|null} obj.component
 * @param {string} obj.variant
 * @returns {Promise<object>}
 */
export const getHtml = async (
	{ component, variant } = { component: null, variant: "default" },
) => {
	if (!component)
		return {
			success: false,
			message: 'Please pass a component to `getHtml` ({ component: "name" }).',
		};

	const { success, data, message } = await getMockData({ component, variant });

	if (!success) return { success, message };

	const result = await renderIframeVariationStandalone({
		component: getComponentsObject(component),
		componentData: data,
	});

	return {
		success: true,
		data: result,
	};
};

export const createBuild = async () => {
	global.app = await init("api", { isBuild: true });

	try {
		const message = await build();

		return {
			success: true,
			message,
		};
	} catch (message) {
		return {
			success: false,
			message,
		};
	}
};

export const createMockData = async ({ component }) => {
	if (!component) {
		return {
			success: false,
			message: t("dataGenerator.noComponentFolderDefined"),
		};
	}

	try {
		global.app = await init("api");

		const { success, message } = await generateMockData(
			path.join(global.config.components.folder, component),
			global.config.files,
		);

		if (success) {
			return {
				success: true,
			};
		}

		return {
			success,
			message: message.text,
		};
	} catch (message) {
		return {
			success: false,
			message,
		};
	}
};

export const createComponent = async ({ component, only = [], skip = [] }) => {
	global.app = await init("api");

	let fileTypes = ["css", "docs", "js", "mocks", "schema", "tpl"];

	if (only.length > 0) {
		fileTypes = only;
	} else if (skip.length > 0) {
		fileTypes = fileTypes.filter((value) => !skip.includes(value));
	}

	try {
		const result = await generateComponent({
			component: path.join(global.config.components.folder, component),
			fileTypes,
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
};

export const lintComponents = async () => {
	global.app = await init("api");
	const promises = [];

	global.state.routes.forEach((route) => {
		if (route.paths.tpl) {
			promises.push(
				new Promise((resolve) => {
					getComponentData(route).then((data) => {
						const validation = validateMockData(route, data || [], true);

						resolve({
							component: route.alias,
							errors: validation,
						});
					});
				}),
			);
		}
	});

	return await Promise.all(promises)
		.then((res) => {
			const errors = res.filter((result) => result?.errors?.length > 0);

			return {
				success: errors.length === 0,
				data: errors,
			};
		})
		.catch((err) => {
			return { success: false, message: err.toString() };
		});
};

export const lintComponent = async ({ component }) => {
	global.app = await init("api");

	const componentObject = getComponentsObject(component);

	if (!componentObject)
		return {
			success: false,
			message: `The component ${component} does not seem to exist.`,
		};

	const data = await getComponentData(componentObject);
	const errors = validateMockData(componentObject, data, true);

	return {
		success: errors === null || errors?.length === 0,
		data: errors,
	};
};

/**
 * @param {string} component
 * @returns {object}
 */
function getComponentsObject(component) {
	return global.state.routes.find(
		(route) => route.paths.dir.short === component,
	);
}
