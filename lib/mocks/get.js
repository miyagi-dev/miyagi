import { resolveData } from "./resolve.js";
import config from "../default-config.js";
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

					context[startIndex + index] = {
						messages,
						component: component.paths.dir.short,
						resolved: resolved,
						raw: merged,
						name: variationJson.$name,
					};
				}
			}

			if (Object.keys(data.resolved).length > 0) {
				if (!componentJson.$hidden) {
					context.unshift({
						messages: data.messages,
						component: component.paths.dir.short,
						resolved: data.resolved,
						raw: data.merged,
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

				context.unshift({
					messages,
					component: component.paths.dir.short,
					resolved: componentJson.$hidden ? {} : resolved,
					raw: componentJson.$hidden ? {} : merged,
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
	const data = await getComponentData(component);

	return (
		data?.filter(
			(entry) =>
				entry.name.toLowerCase().replaceAll(" ", "-") ===
				variation.toLowerCase().replaceAll(" ", "-"),
		)[0] ?? null
	);
};
