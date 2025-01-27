import deepMerge from "deepmerge";
import * as helpers from "../helpers.js";
import { resolveRefs } from "./resolve/ref.js";
import { resolveTpls } from "./resolve/tpl.js";
import { extendTemplateData } from "../render/helpers.js";

/**
 * @param {string} method
 * @returns {Function}
 */
function getMergeMethod(method) {
	const methods = {
		combine: (target, source, options) => {
			const destination = target.slice();

			source.forEach((item, index) => {
				if (options.isMergeableObject(item)) {
					if (typeof destination[index] === "undefined") {
						destination[index] = options.cloneUnlessOtherwiseSpecified(
							item,
							options,
						);
					} else {
						destination[index] = deepMerge(target[index], item, options);
					}
				} else {
					destination[index] = options.cloneUnlessOtherwiseSpecified(
						item,
						options,
					);
				}
			});

			return destination;
		},

		overwrite: (destinationArray, sourceArray) => sourceArray,
	};

	return methods[method];
}

/**
 * @param {object} data - the mock data object that will be passed into the component
 * @param {object} component
 * @param {object} [rootData] - the root mock data object
 * @returns {Promise<{ merged, resolved, messages }>} the resolved data object
 */
export const resolveData = async function (data, component, rootData) {
	const mergedWithGlobalData = mergeWithGlobalData(
		rootData ? mergeRootDataWithVariationData(rootData, data) : data,
	);
	const { data: refsResolved, messages: refMessages } = await resolveRefs(
		{ ...mergedWithGlobalData },
		component,
	);
	const { data: tplsResolved, messages: tplMessages } =
		await resolveTpls(refsResolved);

	const resolved = await extendTemplateData(
		global.config,
		overwriteRenderKey(tplsResolved),
		component,
	);

	return {
		merged: mergedWithGlobalData,
		resolved,
		messages: [...refMessages, ...tplMessages],
	};
};

/**
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {object} the resolved data object
 */
export const overwriteRenderKey = function (data) {
	let o;

	if (data) {
		o = { ...data };
		const entries = Object.entries(o);

		for (const [key, val] of entries) {
			if (key === "$render") {
				let str = "";

				if (val) {
					for (const html of val) {
						str += html;
					}
				}

				o = str;
			} else {
				if (
					typeof val == "string" ||
					typeof val === "number" ||
					typeof val === "boolean" ||
					val === null
				) {
					o[key] = val;
				} else if (Array.isArray(val)) {
					val.forEach((v, i) => {
						if (
							typeof v == "string" ||
							typeof v === "number" ||
							typeof v === "boolean" ||
							val === null
						) {
							o[key][i] = v;
						} else {
							o[key][i] = overwriteRenderKey(v);
						}
					});
				} else {
					o[key] = overwriteRenderKey(val);
				}
			}
		}
	}

	return o;
};

/**
 * @param {object} rootData - the root mock data of a component
 * @param {object} variationData - a variation mock data of a component
 * @returns {object} the merged data
 */
export const mergeRootDataWithVariationData = function (
	rootData,
	variationData,
) {
	if (!rootData) {
		return variationData;
	}

	if (!variationData) {
		return rootData;
	}

	const merged = deepMerge(rootData, variationData, {
		customMerge: (key) => {
			const options = variationData.$opts || rootData.$opts;

			if (options) {
				const option = options[key];

				if (option) {
					return getMergeMethod(option);
				}
			}

			return undefined;
		},
	});

	if (merged.$opts) {
		delete merged.$opts;
	}

	return merged;
};

/**
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {object} the merged data object
 */
function mergeWithGlobalData(data) {
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

	delete globalData.$defs;

	return {
		...globalData,
		...data,
	};
}
