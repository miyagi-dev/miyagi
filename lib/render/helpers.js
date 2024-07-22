/**
 * Helper functions for the render module
 * @module renderHelpers
 */

import path from "path";
import deepMerge from "deepmerge";
import * as helpers from "../helpers.js";

/**
 * @param {object} config - the user configuration object
 * @param {object} data - the mock data object that will be passed into the component
 * @param {object} component
 * @returns {Promise<object>} the extended data object
 */
export const extendTemplateData = async (config, data, component) => {
	for (const extension of config.extensions) {
		if (extension) {
			const ext = Array.isArray(extension) ? extension[0] : extension;

			if (ext.extendTemplateData) {
				data = await ext.extendTemplateData(
					path.join(config.components.folder, component.paths.tpl.short),
					config.engine.options,
					data,
				);
			}
		}
	}

	return data;
};

/**
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {object} the resolved data object
 */
export const getDataForRenderFunction = (data) => {
	const fullPath = path.join(process.cwd(), global.config.components.folder);

	return {
		...data,
		path: fullPath,
		partials: global.state.partials,
		basedir: fullPath, // for pug
		root: fullPath, // for ect
		settings: {
			views: fullPath, // for dust
		},
		...global.config.engine.options,
	};
};

/**
 * @param {Array} variations - the variations of the mock data of the component
 * @param {object} [rootData] - the root mock data of the component
 * @returns {object} the fallback data object
 */
export const getFallbackData = (variations, rootData) => {
	for (let i = 0; i < variations.length; i += 1) {
		const variationData = helpers.removeInternalKeys(variations[i]);

		if (Object.keys(variationData).length > 0) {
			if (rootData) {
				return deepMerge(rootData, variationData);
			}

			return variationData;
		}
	}

	return {};
};

export const getThemeMode = (cookies = {}) => {
	return cookies[`miyagi_${global.config.projectName}_theme`];
};

export const getComponentTextDirection = (cookies = {}) => {
	return cookies[`miyagi_${global.config.projectName}_text_direction`];
};
