/**
 * Module for getting the structure for the menu
 *
 * @module stateMenuStructure
 */
const path = require("path");

const config = require("../../config.json");
const log = require("../../logger.js");
const helpers = require("../../helpers.js");

/**
 * @param {object} json - mock data object
 * @param {string} fullPath - the path of the mock file
 * @returns {Array} all valid variation objects
 */
function getAllValidVariations(json, fullPath) {
	let arr = [];

	if (json) {
		const variations = json.$variants;
		const rootData = helpers.removeInternalKeys(json);

		if (Object.keys(rootData).length > 0 && !json.$hidden) {
			arr.push({
				name: json.$name || config.defaultVariationName,
				data: rootData,
			});
		}

		if (variations) {
			for (const [i, variation] of variations.entries()) {
				const variationData = helpers.removeInternalKeys(variation);
				if (variation.$name) {
					arr.push({
						name: variation.$name,
						data: variationData,
					});
				} else if (fullPath) {
					const shortPath = path.join(
						"components",
						helpers.getShortPathFromFullPath(fullPath)
					);
					log(
						"warn",
						config.messages.noNameSetForVariation
							.replace("{{i}}", i)
							.replace("{{file}}", shortPath)
					);
				}
			}
		}
	} else {
		arr.push({
			name: config.defaultVariationName,
			data: {},
		});
	}

	return arr;
}

/**
 * @param {string} mockFilePath - mock file to get the data from
 * @returns {object[]} all valid variations for the given mock file
 */
function getData(mockFilePath) {
	let result;

	if (global.state.fileContents[mockFilePath]) {
		result = global.state.fileContents[mockFilePath];
	}

	return getAllValidVariations(result, mockFilePath);
}

/**
 * @param {object} obj - file tree object
 * @returns {Array} all variations for the mock file of the given file tree object
 */
function getVariations(obj) {
	const { mocks } = global.config.files;
	const tplChild = obj.children.find(
		(o) =>
			o.name ===
			`${helpers.getResolvedFileName(
				global.config.files.templates.name,
				obj.name
			)}.${global.config.files.templates.extension}`
	);
	const jsonChild = obj.children.find((o) =>
		[
			`${mocks.name}.${mocks.extension[0]}`,
			`${mocks.name}.${mocks.extension[1]}`,
		].includes(o.name)
	);

	if (tplChild) {
		return getData(jsonChild ? jsonChild.path : "");
	}

	return [];
}

/**
 * @param {object} obj - the source object to update
 * @returns {object} the updated object
 */
function updateSourceObject(obj) {
	const o = { ...obj };

	if (o.children) {
		o.variations = getVariations(o);
		o.children = o.children.map((child) => updateSourceObject(child));
	}

	return o;
}

/**
 * Adds the given index to the given object and recursively calls this
 * method for its children
 *
 * @param {object} obj - the object to which the index should be added
 * @param {number} index - the index that should be added
 * @returns {object} the updated object
 */
function addIndices(obj, index) {
	const o = { ...obj };
	o.index = index;

	if (o.children) {
		o.children = o.children.map((child) => {
			delete child.size;
			return addIndices(child, child.type === "directory" ? index + 1 : index);
		});
	}

	return o;
}

module.exports = function setMenuStructure() {
	let result = updateSourceObject(global.state.sourceTree.components);

	result = addIndices(result, -1);

	return result && result.children ? result.children : [];
};
