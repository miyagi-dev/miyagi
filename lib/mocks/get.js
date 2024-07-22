import resolveData from "./resolve.js";
import config from "../default-config.js";
import { extendTemplateData } from "../render/helpers.js";
import * as helpers from "../helpers.js";

export const getComponentData = async function getComponentData(component) {
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
			data = await resolveData(componentData);
		} else {
			data = {
				merged: componentData,
				resolved: componentData,
			};
		}

		if (componentVariations) {
			const promises = [];
			let startIndex = context.length;
			for (const [index, variationJson] of componentVariations.entries()) {
				if (variationJson.$name) {
					promises.push(
						new Promise((resolve, reject) => {
							const variationData = helpers.removeInternalKeys(variationJson);

							resolveData(variationData, rootData)
								.then(async ({ merged, resolved }) => {
									const extendedData = hasTemplate
										? await extendTemplateData(
												global.config,
												resolved,
												component,
											)
										: {};

									context[startIndex + index] = {
										component: component.paths.dir.short,
										data: extendedData,
										rawData: merged,
										name: variationJson.$name,
									};
									resolve();
								})
								.catch((err) => {
									reject(err);
								});
						}),
					);
				}
			}

			return await Promise.all(promises)
				.then(async () => {
					if (Object.keys(data.resolved).length > 0) {
						const extendedComponentData = await extendTemplateData(
							global.config,
							data.resolved,
							component,
						);

						if (!componentJson.$hidden) {
							context.unshift({
								component: component.paths.dir.short,
								data: extendedComponentData,
								rawData: data.merged,
								name: componentJson.$name || config.defaultVariationName,
							});
						}
					}

					return context.filter((entry) => entry !== null);
				})
				.catch((err) => err);
		} else {
			if (Object.keys(componentData).length > 0) {
				const { merged, resolved } = await resolveData(componentData);
				const extendedComponentData = await extendTemplateData(
					global.config,
					resolved,
					component,
				);

				context.unshift({
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
				raw: null,
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
						raw: null,
						extended: null,
					};
				}
			}
		}
	}

	if (variation === "default") {
		const { merged, resolved } = await resolveData(componentRootData);
		return {
			raw: merged,
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

	const { merged, resolved } = await resolveData(
		componentData,
		componentRootData,
	);
	return {
		raw: merged,
		extended: await extendTemplateData(global.config, resolved, component),
	};
};
