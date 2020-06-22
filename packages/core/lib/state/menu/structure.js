/**
 * Module for getting the structure for the menu
 *
 * @module state/menu/structure
 */

const config = require("../../config.json");
const log = require("../../logger.js");
const helpers = require("../../helpers.js");

/**
 * @param {object} app - the express instance
 * @param json
 * @param fullPath
 */
function handleFileResult(app, json, fullPath) {
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
        if (variation.$name && Object.keys(variationData).length > 0) {
          arr.push({
            name: variation.$name,
            data: variationData,
          });
        } else if (fullPath) {
          const shortPath = helpers.getShortPathFromFullPath(app, fullPath);
          if (!variation.$name) {
            log(
              "warn",
              config.messages.noNameSetForVariation
                .replace("{{i}}", i)
                .replace("{{file}}", shortPath)
            );
          } else {
            log(
              "warn",
              config.messages.noDataSetForVariation
                .replace("{{variation}}", variation.$name)
                .replace("{{file}}", shortPath)
            );
          }
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
 * @param jsonChild
 */
function getData(app, jsonChild) {
  const fullPath = jsonChild.path;
  let result;

  if (app.get("state").fileContents[fullPath]) {
    result = app.get("state").fileContents[fullPath];
  }

  return handleFileResult(app, result, fullPath);
}

/**
 * @param {object} app - the express instance
 * @param obj
 */
function getVariations(app, obj) {
  const tplChild = obj.children.find(
    (o) =>
      o.name ===
      `${helpers.getResolvedFileName(
        app.get("config").files.templates.name,
        obj.name
      )}.${app.get("config").files.templates.extension}`
  );
  const jsonChild =
    obj.children.find(
      (o) =>
        o.name ===
        `${app.get("config").files.mocks.name}.${
          app.get("config").files.mocks.extension
        }`
    ) || {};

  if (tplChild) {
    return getData(app, jsonChild);
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
  let result = updateSourceObject(app, app.get("state").sourceTree);

  result = addIndices(result, -1);

  return result && result.children ? result.children : [];
};
