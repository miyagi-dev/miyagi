/**
 * Helper functions for the render module
 *
 * @module renderHelpers
 */

const path = require("path");
const deepMerge = require("deepmerge");
const helpers = require("../helpers.js");

module.exports = {
	/**
	 * @param {object} config - the user configuration object
	 * @param {object} data - the mock data object that will be passed into the component
	 * @param {string} filePath - the path to the component file
	 * @returns {Promise<object>} the extended data object
	 */
	async extendTemplateData(config, data, filePath) {
		let fullFilePath = filePath.endsWith(config.files.templates.extension)
			? filePath
			: `${filePath}/${path.basename(filePath)}.${
					config.files.templates.extension
			  }`;

		for (const extension of config.extensions) {
			if (extension) {
				const ext = Array.isArray(extension) ? extension[0] : extension;

				if (ext.extendTemplateData) {
					data = await ext.extendTemplateData(
						path.join(config.components.folder, fullFilePath),
						config.engine.options,
						data
					);
				}
			}
		}

		return data;
	},

	/**
	 * @param {object} data - the mock data object that will be passed into the component
	 * @returns {object} the resolved data object
	 */
	getDataForRenderFunction(data) {
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
	},

	/**
	 * @param {Array} variations - the variations of the mock data of the component
	 * @param {object} [rootData] - the root mock data of the component
	 * @returns {object} the fallback data object
	 */
	getFallbackData(variations, rootData) {
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
	},

	getThemeMode(cookies = {}) {
		return cookies[`miyagi_${global.config.projectName}_theme`];
	},

	getComponentTextDirection(cookies = {}) {
		return cookies[`miyagi_${global.config.projectName}_text_direction`];
	},
};
