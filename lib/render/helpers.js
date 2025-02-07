/**
 * Helper functions for the render module
 * @module renderHelpers
 */

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
