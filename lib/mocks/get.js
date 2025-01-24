import { resolveData } from "./resolve.js";
import config from "../default-config.js";
import { extendTemplateData } from "../render/helpers.js";
import * as helpers from "../helpers.js";

/**
 * @param {object} component
 * @returns {Promise<[]>}
 */
export const getComponentData = async function getComponentData(component) {
	if (!component) return null;

	const componentJson = helpers.cloneDeep(
		global.state.fileContents[
			component.paths.mocks.full(global.config.files.mocks.extension[0])
		] ||
			global.state.fileContents[
				component.paths.mocks.full(global.config.files.mocks.extension[1])
			],
	);

	const hasTemplate =
		component.paths.tpl &&
		Object.values(global.state.partials).includes(component.paths.tpl.full);

	let context = null;

	if (componentJson) {
		context = [];
		let componentData = helpers.removeInternalKeys(componentJson);
		const rootData = helpers.cloneDeep(componentData);
		const componentVariations = componentJson.$variants;
		let data;

		if (Object.keys(componentData).length > 0) {
			data = await resolveData(componentData, component);
		} else {
			data = {
				messages: [],
				merged: componentData,
				resolved: componentData,
			};
		}

		if (componentVariations) {
			let startIndex = context.length;
			for (const [index, variationJson] of componentVariations.entries()) {
				if (variationJson.$name) {
					const variationData = helpers.removeInternalKeys(variationJson);

					const { messages, merged, resolved } = await resolveData(
						variationData,
						component,
						rootData,
					);

					const extendedData = hasTemplate
						? await extendTemplateData(global.config, resolved, component)
						: {};

					context[startIndex + index] = {
						messages,
						component: component.paths.dir.short,
						data: extendedData,
						rawData: merged,
						name: variationJson.$name,
					};
				}
			}

			if (Object.keys(data.resolved).length > 0) {
				const extendedComponentData = await extendTemplateData(
					global.config,
					data.resolved,
					component,
				);

				if (!componentJson.$hidden) {
					context.unshift({
						messages: data.messages,
						component: component.paths.dir.short,
						data: extendedComponentData,
						rawData: data.merged,
						name: componentJson.$name || config.defaultVariationName,
					});
				}
			}

			return context.filter((entry) => entry !== null);
		} else {
			if (Object.keys(componentData).length > 0) {
				const { messages, merged, resolved } = await resolveData(
					componentData,
					component,
				);
				const extendedComponentData = await extendTemplateData(
					global.config,
					resolved,
					component,
				);

				context.unshift({
					messages,
					component: component.paths.dir.short,
					data: componentJson.$hidden ? {} : extendedComponentData,
					rawData: componentJson.$hidden ? {} : merged,
					name: componentJson.$name || config.defaultVariationName,
				});
			}

			return context;
		}
	}

	return context;
};

export const getVariationData = async function getVariationData(
	component,
	variation,
) {
	const componentJson = helpers.cloneDeep(
		global.state.fileContents[
			component.paths.mocks.full(global.config.files.mocks.extension[0])
		] ||
			global.state.fileContents[
				component.paths.mocks.full(global.config.files.mocks.extension[1])
			],
	);

	if (!componentJson) return null;

	const componentVariations = componentJson.$variants;
	let componentRootData = helpers.removeInternalKeys(componentJson);
	let componentData;

	if (componentJson.$hidden) {
		if (!variation) {
			return {
				messages: [],
				raw: null,
				resolved: null,
				extended: null,
			};
		}

		if (variation === "default") {
			if (componentVariations) {
				const componentVariationsIncludesDefault = Boolean(
					componentVariations.find((variant) => variant.$name === "default"),
				);

				if (!componentVariationsIncludesDefault) {
					return {
						messages: [],
						raw: null,
						resolved: null,
						extended: null,
					};
				}
			}
		}
	}

	if (variation === "default") {
		const { merged, resolved, messages } = await resolveData(
			componentRootData,
			component,
		);
		return {
			messages,
			raw: merged,
			resolved,
			extended: await extendTemplateData(global.config, resolved, component),
		};
	}

	if (componentVariations && variation) {
		let variationJson = componentVariations.find((vari) => {
			return (
				helpers.normalizeString(vari.$name) ===
				helpers.normalizeString(variation)
			);
		});
		if (variationJson) {
			componentData = helpers.removeInternalKeys(variationJson);
		} else {
			return null;
		}
	}

	const { merged, resolved, messages } = await resolveData(
		componentData,
		component,
		componentRootData,
	);
	return {
		messages,
		raw: merged,
		resolved,
		extended: await extendTemplateData(global.config, resolved, component),
	};
};
