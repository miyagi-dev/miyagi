/**
 * Helper functions for the render module
 * @module renderHelpers
 */

import path from "path";

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

export const getUserUiConfig = (cookies = {}) => {
	const projectName = global.config.projectName.replaceAll(" ", "-");
	const mode = cookies[`miyagi_${projectName}_mode`];
	const theme = cookies[`miyagi_${projectName}_theme`];
	const componentTextDirection =
		cookies[`miyagi_${projectName}_text_direction`];

	return {
		mode: global.config.isBuild ? "presentation" : mode || "dev",
		theme: theme || global.config.ui.mode,
		componentTextDirection:
			componentTextDirection || global.config.components.textDirection,
	};
};

export const getThemeMode = (cookies = {}) => {
	return cookies[
		`miyagi_${global.config.projectName.replaceAll(" ", "-")}_theme`
	];
};
