const resolveData = require("./resolve");
const config = require("../config.json");
const { extendTemplateData } = require("../render/helpers");
const helpers = require("../helpers");

module.exports = {
	getComponentData: async function getComponentData(app, file) {
		const templateFilePath = helpers.getFullPathFromShortPath(app, file);
		const componentJson = helpers.cloneDeep(
			app.get("state").fileContents[
				helpers.getDataPathFromTemplatePath(
					app,
					templateFilePath,
					app.get("config").files.mocks.extension[0]
				)
			] ||
				app.get("state").fileContents[
					helpers.getDataPathFromTemplatePath(
						app,
						templateFilePath,
						app.get("config").files.mocks.extension[1]
					)
				]
		);

		const hasTemplate = Object.values(app.get("state").partials).includes(
			templateFilePath
		);

		let context = [];

		if (componentJson) {
			let componentData = helpers.removeInternalKeys(componentJson);
			const rootData = helpers.cloneDeep(componentData);
			const componentVariations = componentJson.$variants;
			let data;

			if (Object.keys(componentData).length > 0) {
				data = await resolveData(app, componentData);
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

								resolveData(app, variationData, rootData)
									.then(async ({ merged, resolved }) => {
										const extendedData = hasTemplate
											? await extendTemplateData(
													app.get("config"),
													resolved,
													file
											  )
											: {};

										context[startIndex + index] = {
											component: file,
											data: extendedData,
											rawData: merged,
											name: variationJson.$name,
										};
										resolve();
									})
									.catch((err) => {
										reject(err);
									});
							})
						);
					}
				}

				return await Promise.all(promises)
					.then(async () => {
						if (Object.keys(data.resolved).length > 0) {
							const extendedComponentData = await extendTemplateData(
								app.get("config"),
								data.resolved,
								file
							);

							if (!componentJson.$hidden) {
								context.unshift({
									component: file,
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
					const { merged, resolved } = await resolveData(app, componentData);
					const extendedComponentData = await extendTemplateData(
						app.get("config"),
						resolved,
						file
					);

					context.unshift({
						component: file,
						data: componentJson.$hidden ? {} : extendedComponentData,
						rawData: componentJson.$hidden ? {} : merged,
						name: componentJson.$name || config.defaultVariationName,
					});
				}

				return context;
			}
		}

		return context;
	},

	getVariationData: async function getVariationData(app, file, variation) {
		const fullFilePath = helpers.getFullPathFromShortPath(app, file);
		const componentJson = helpers.cloneDeep(
			app.get("state").fileContents[
				helpers.getDataPathFromTemplatePath(
					app,
					fullFilePath,
					app.get("config").files.mocks.extension[0]
				)
			] ||
				app.get("state").fileContents[
					helpers.getDataPathFromTemplatePath(
						app,
						fullFilePath,
						app.get("config").files.mocks.extension[1]
					)
				]
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
						componentVariations.find((variant) => variant.$name === "default")
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
			const { merged, resolved } = await resolveData(app, componentRootData);
			return {
				raw: merged,
				extended: await extendTemplateData(app.get("config"), resolved, file),
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
			app,
			componentData,
			componentRootData
		);
		return {
			raw: merged,
			extended: await extendTemplateData(app.get("config"), resolved, file),
		};
	},
};
