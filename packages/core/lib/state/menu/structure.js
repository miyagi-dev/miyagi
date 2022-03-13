/**
 * Module for getting the structure for the menu
 *
 * @module stateMenuStructure
 */

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
          const shortPath = helpers.getShortPathFromFullPath(fullPath);
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
 * @param {object} app - the express instance
 * @param {string} mockFilePath - mock file to get the data from
 * @returns {object[]} all valid variations for the given mock file
 */
function getData(app, mockFilePath) {
  let result;

  if (app.get("state").fileContents[mockFilePath]) {
    result = app.get("state").fileContents[mockFilePath];
  }

  return getAllValidVariations(result, mockFilePath);
}

/**
 * @param {object} app - the express instance
 * @param {object} obj - file tree object
 * @returns {Array} all variations for the mock file of the given file tree object
 */
function getVariations(app, obj) {
  const { mocks } = app.get("config").files;
  const tplChild = obj.children.find(
    (o) =>
      o.name ===
      `${helpers.getResolvedFileName(
        app.get("config").files.templates.name,
        obj.name
      )}.${app.get("config").files.templates.extension}`
  );
  const jsonChild = obj.children.find((o) =>
    [
      `${mocks.name}.${mocks.extension[0]}`,
      `${mocks.name}.${mocks.extension[1]}`,
    ].includes(o.name)
  );

  if (tplChild) {
    return getData(app, jsonChild ? jsonChild.path : "");
  }

  return [];
}

/**
 * @param {object} app - the express instance
 * @param {object} obj - the source object to update
 * @returns {object} the updated object
 */
function updateSourceObject(app, obj) {
  const o = { ...obj };

  if (o.children) {
    o.variations = getVariations(app, o);
    o.children = o.children.map((child) => updateSourceObject(app, child));
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

module.exports = function setMenuStructure(app) {
  let result = [];

  app.get("state").sourceTree.forEach((tree) => {
    result.push(addIndices(updateSourceObject(app, tree), -1));
  });

  return result;
};
