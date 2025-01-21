import fs from "fs";
import { promisify } from "util";
import path from "path";
import deepMerge from "deepmerge";

import log from "../../logger.js";
import * as helpers from "../../helpers.js";
import { t } from "../../i18n/index.js";
import { mergeRootDataWithVariationData } from "../resolve.js";

const fileStat = promisify(fs.lstat);

/**
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @param {object} component
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
export const resolveRefs = async function (entry, component) {
	if (entry) {
		if (
			typeof entry === "string" ||
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			entry === null
		) {
			return entry;
		}

		if (entry instanceof Array) {
			const o = [];
			const promises = [];

			entry.forEach((ent, i) => {
				promises.push(
					new Promise((resolve, reject) => {
						resolveJson(ent, component)
							.then((result) => resolveRefs(result, component))
							.then((result) => {
								o[i] = result;
								resolve();
							})
							.catch((err) => {
								reject(err);
							});
					}),
				);
			});

			return Promise.all(promises)
				.then(() => {
					return o;
				})
				.catch((err) => log("error", err.message, err));
		}

		let o = entry;

		await Promise.all(
			Object.entries({ ...entry }).map(async ([key, value]) => {
				if (key === "$ref") {
					let resolvedValue = await getRootOrVariantDataOfReference(
						value,
						component,
					);
					resolvedValue = await resolveRefs(
						await resolveJson(resolvedValue, component),
						component,
					);
					o = { ...o, ...resolvedValue };
					delete o.$ref;
				} else {
					const resolvedValue = await resolveRefs(
						await resolveJson(value, component),
						component,
					);

					o[key] = resolvedValue;
				}

				return true;
			}),
		);

		return o;
	}

	return entry;
};

/**
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @param {object} component
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function resolveJson(entry, component) {
	if (entry !== null) {
		if (Array.isArray(entry)) {
			return entry;
		}

		if (
			typeof entry === "string" ||
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			entry === null
		) {
			return entry;
		}

		if (entry === undefined) {
			log("warn", t("referencedMockFileNotFound"));
			return entry;
		}

		if (entry.$ref) {
			const customData = helpers.cloneDeep(entry);
			delete customData.$ref;

			const resolvedJson = await getRootOrVariantDataOfReference(
				entry.$ref,
				component,
			);

			return deepMerge(resolvedJson, customData);
		}
	}

	return entry;
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
			return componentJson.$defs[defRef];
		}

		log(
			"warn",
			t("fileNotFoundLinkIncorrect")
				.replace("{{filePath}}", mocksBaseName)
				.replace(
					"{{component}}",
					component.paths.mocks.short(global.config.files.mocks.extension[0]) ||
						component.paths.mocks.short(global.config.files.mocks.extension[1]),
				),
		);
		return {};
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
			return globalData.$defs[defRef];
		}

		log(
			"warn",
			t("fileNotFoundLinkIncorrect")
				.replace("{{filePath}}", ref)
				.replace(
					"{{component}}",
					component.paths.mocks.short(global.config.files.mocks.extension[0]) ||
						component.paths.mocks.short(global.config.files.mocks.extension[1]),
				),
		);
		return {};
	}

	if (shortVal.startsWith("@")) {
		const namespace = shortVal.split("/")[0];
		const resolvedNamespace = global.config.namespaces[namespace];
		const stat = await fileStat(resolvedNamespace);

		if (stat.isSymbolicLink()) {
			shortVal = helpers.getShortPathFromFullPath(
				shortVal.replace(
					namespace,
					path.join(
						path.dirname(resolvedNamespace),
						fs.readlinkSync(resolvedNamespace),
					),
				),
			);
		} else {
			shortVal = shortVal.replace(
				namespace,
				helpers.getShortPathFromFullPath(resolvedNamespace),
			);
		}
	}

	mocksBaseName = path.join(shortVal, mocks.name);

	jsonFromData =
		global.state.fileContents[
			helpers.getFullPathFromShortPath(`${mocksBaseName}.${mocks.extension[0]}`)
		] ||
		global.state.fileContents[
			helpers.getFullPathFromShortPath(`${mocksBaseName}.${mocks.extension[1]}`)
		];

	if (jsonFromData) {
		if (variation?.startsWith("/$defs/") && "$defs" in jsonFromData) {
			const defRef = variation.replace("/$defs/", "");

			if (defRef in jsonFromData.$defs) {
				return jsonFromData.$defs[defRef];
			}

			log(
				"warn",
				t("fileNotFoundLinkIncorrect")
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
			);
			return {};
		}

		const embeddedJson = jsonFromData;
		let variantJson = {};
		const rootJson = helpers.removeInternalKeys(embeddedJson);

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
				log(
					"warn",
					t("variationNotFound")
						.replace("{{variation}}", variation)
						.replace("{{fileName}}", mocksBaseName),
				);
			}
		}

		return mergeRootDataWithVariationData(
			helpers.cloneDeep(rootJson),
			variantJson,
		);
	}

	log(
		"warn",
		t("fileNotFoundLinkIncorrect")
			.replace("{{filePath}}", mocksBaseName)
			.replace(
				"{{component}}",
				component.paths.mocks.short(global.config.files.mocks.extension[0]) ||
					component.paths.mocks.short(global.config.files.mocks.extension[1]),
			),
	);

	return {};
}
