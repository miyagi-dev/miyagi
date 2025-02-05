import path from "path";
import deepMerge from "deepmerge";

import * as helpers from "../../helpers.js";
import { t } from "../../i18n/index.js";
import { mergeRootDataWithVariationData } from "../resolve.js";

/**
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @param {object} component
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
export const resolveRefs = async function (entry, component) {
	const messages = [];

	if (entry) {
		if (
			typeof entry === "string" ||
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			entry === null
		) {
			return {
				messages,
				data: entry,
			};
		}

		if (entry instanceof Array) {
			const o = [];

			for (const ent of entry) {
				const json = await resolve(ent, component);
				const result = await resolveRefs(json.data, component);

				o.push(result.data);

				for (const msg of [...json.messages, ...result.messages]) {
					if (msg) {
						messages.push(msg);
					}
				}
			}

			return {
				messages,
				data: o,
			};
		}

		let o = entry;

		for (const [key, value] of Object.entries({ ...entry })) {
			if (key === "$ref") {
				let { message, data: resolvedValue } =
					await getRootOrVariantDataOfReference(value, component);

				if (message) {
					messages.push(message);
				}

				const json = await resolve(resolvedValue, component);
				const result = await resolveRefs(json.data, component);

				for (const msg of [...json.messages, ...result.messages]) {
					if (msg) {
						messages.push(msg);
					}
				}

				o = { ...o, ...result.data };
				delete o.$ref;
			} else {
				const json = await resolve(value, component);
				const result = await resolveRefs(json.data, component);

				o[key] = result.data;

				for (const msg of [...json.messages, ...result.messages]) {
					if (msg) {
						messages.push(msg);
					}
				}
			}
		}

		return {
			messages,
			data: o,
		};
	}

	return {
		messages,
		data: entry,
	};
};

/**
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @param {object} component
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function resolve(entry, component) {
	const messages = [];

	if (entry !== null) {
		if (Array.isArray(entry)) {
			return {
				messages,
				data: entry,
			};
		}

		if (
			typeof entry === "string" ||
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			entry === null
		) {
			return {
				messages,
				data: entry,
			};
		}

		if (entry === undefined) {
			return {
				messages: [
					...messages,
					{
						type: "warn",
						text: t("referencedMockFileNotFound"),
					},
				],
				data: entry,
			};
		}

		if (entry.$ref) {
			const customData = helpers.cloneDeep(entry);
			delete customData.$ref;

			const { message, data } = await getRootOrVariantDataOfReference(
				entry.$ref,
				component,
			);

			return {
				messages: [...messages, message],
				data: deepMerge(data, customData),
			};
		}
	}

	return {
		messages,
		data: entry,
	};
}

/**
 * @param {string} ref - the reference to another mock data
 * @param {object} component
 * @returns {Promise<object>} the resolved data object
 */
async function getRootOrVariantDataOfReference(ref, component) {
	const { mocks } = global.config.files;

	let [shortVal, variation] = ref.split("#");
	let jsonFromData;
	let mocksBaseName;
	let fullPath;

	if (ref.startsWith("#/$defs/")) {
		const componentJson = helpers.cloneDeep(
			global.state.fileContents[
				component.paths.mocks.full(global.config.files.mocks.extension[0])
			] ||
				global.state.fileContents[
					component.paths.mocks.full(global.config.files.mocks.extension[1])
				],
		);

		mocksBaseName = ref;

		const defRef = ref.replace("#/$defs/", "");
		if ("$defs" in componentJson && defRef in componentJson.$defs) {
			return {
				data: componentJson.$defs[defRef],
			};
		}

		return {
			message: {
				type: "warn",
				text: t("fileNotFoundLinkIncorrect")
					.replace("{{filePath}}", mocksBaseName)
					.replace(
						"{{component}}",
						component.paths.mocks.short(
							global.config.files.mocks.extension[0],
						) ||
							component.paths.mocks.short(
								global.config.files.mocks.extension[1],
							),
					),
			},
			data: {},
		};
	}

	if (ref.startsWith("data/#/$defs/")) {
		const defaultFile = helpers.getFullPathFromShortPath(
			`data.${global.config.files.mocks.extension[0]}`,
		);
		const jsFile = helpers.getFullPathFromShortPath(
			`data.${global.config.files.mocks.extension[1]}`,
		);
		const globalData = {
			...(global.state.fileContents[defaultFile] ||
				global.state.fileContents[jsFile]),
		};

		const defRef = ref.replace("data/#/$defs/", "");

		if (defRef in globalData.$defs) {
			return {
				data: globalData.$defs[defRef],
			};
		}

		return {
			message: {
				type: "warn",
				text: t("fileNotFoundLinkIncorrect")
					.replace("{{filePath}}", ref)
					.replace(
						"{{component}}",
						component.paths.mocks.short(
							global.config.files.mocks.extension[0],
						) ||
							component.paths.mocks.short(
								global.config.files.mocks.extension[1],
							),
					),
			},
			data: {},
		};
	}

	if (shortVal.startsWith("@")) {
		const namespace = shortVal.split("/")[0];
		const resolvedNamespace = global.config.namespaces[namespace];

		if (!resolvedNamespace) {
			return {
				message: {
					type: "warn",
					text: `Could not resolve namespace ${namespace}`,
				},
				data: null,
			};
		}

		shortVal = path.relative(namespace, shortVal);
		mocksBaseName = path.join(shortVal, mocks.name);
		fullPath = path.join(
			process.cwd(),
			resolvedNamespace,
			shortVal,
			mocks.name,
		);
	} else {
		mocksBaseName = path.join(shortVal, mocks.name);
		fullPath = helpers.getFullPathFromShortPath(mocksBaseName);
	}

	jsonFromData =
		global.state.fileContents[`${fullPath}.${mocks.extension[0]}`] ||
		global.state.fileContents[`${fullPath}.${mocks.extension[1]}`];

	if (jsonFromData) {
		if (variation?.startsWith("/$defs/") && "$defs" in jsonFromData) {
			const defRef = variation.replace("/$defs/", "");

			if (defRef in jsonFromData.$defs) {
				return {
					data: jsonFromData.$defs[defRef],
				};
			}

			return {
				message: {
					type: "warn",
					text: t("fileNotFoundLinkIncorrect")
						.replace("{{filePath}}", ref)
						.replace(
							"{{component}}",
							component.paths.mocks.short(
								global.config.files.mocks.extension[0],
							) ||
								component.paths.mocks.short(
									global.config.files.mocks.extension[1],
								),
						),
				},
				data: {},
			};
		}

		const embeddedJson = jsonFromData;
		const rootJson = helpers.removeInternalKeys(embeddedJson);
		let variantJson = {};
		let message;

		if (variation && embeddedJson.$variants && embeddedJson.$variants.length) {
			const variant = embeddedJson.$variants.find((vari) => {
				if (vari.$name) {
					return (
						helpers.normalizeString(vari.$name) ===
						helpers.normalizeString(variation)
					);
				}
				return false;
			});

			if (variant) {
				variantJson = helpers.removeInternalKeys(variant);
			} else {
				message = {
					type: "warn",
					text: t("variationNotFound")
						.replace("{{variation}}", variation)
						.replace("{{fileName}}", mocksBaseName),
				};
			}
		}

		return {
			message,
			data: mergeRootDataWithVariationData(
				helpers.cloneDeep(rootJson),
				variantJson,
			),
		};
	}

	return {
		message: {
			type: "warn",
			text: t("fileNotFoundLinkIncorrect")
				.replace("{{filePath}}", mocksBaseName)
				.replace(
					"{{component}}",
					component.paths.mocks.short(global.config.files.mocks.extension[0]) ||
						component.paths.mocks.short(global.config.files.mocks.extension[1]),
				),
		},
		data: {},
	};
}
