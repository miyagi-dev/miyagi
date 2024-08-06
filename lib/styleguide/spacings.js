import { getCustomProperties } from "./helpers.js";

/**
 * @param {object} obj
 * @param {string} prefix
 * @returns {Array}
 */
export default function getSpacings(obj, prefix) {
	const spacings = [];

	getCustomProperties(obj, prefix).forEach(({ property, value, mq }) => {
		// filter out negative spacings
		if (property.startsWith(`--${prefix}-`) && !value.startsWith("-")) {
			spacings.push({
				name: property.replace(`--${prefix}-`, ""),
				customProp: property,
				value,
				mq,
			});
		}
	});

	const deduped = {};

	spacings.forEach((e) => {
		if (!deduped[e.name]) {
			deduped[e.name] = {
				customProp: e.customProp,
				value: e.value,
			};
		}
	});

	return Object.entries(deduped);
}
