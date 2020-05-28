const config = require("../../config.json");
const log = require("../../logger.js");
const helpers = require("../../helpers.js");

function handleFileResult(app, json, obj, fullPath) {
  let arr = [];

  if (json) {
    const { variations } = json;

    if (json.data && !json.data.$hidden) {
      arr.push({
        name: config.defaultVariationName,
        data: json.data,
      });
    }

    if (variations && variations.length > 0) {
      arr = [...arr, ...variations];
    }

    arr = arr.filter((variation, i) => {
      if (variation.name && variation.data) {
        return variation;
      }
      if (fullPath) {
        const shortPath = helpers.getShortPathFromFullPath(app, fullPath);
        if (!variation.name) {
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
              .replace("{{variation}}", variation.name)
              .replace("{{file}}", shortPath)
          );
        }
      }
      return false;
    });
  } else {
    arr.push({
      name: config.defaultVariationName,
      data: {},
    });
  }

  return arr;
}

function getData(app, obj, jsonChild) {
  const fullPath = jsonChild.path;
  let result;

  if (app.get("state").fileContents[fullPath]) {
    result = app.get("state").fileContents[fullPath];
  }

  return handleFileResult(app, result, obj, fullPath);
}

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
    return getData(app, obj, jsonChild);
  }

  return [];
}

function updateSourceObject(app, obj) {
  const o = { ...obj };

  if (o.path) {
    o.shortPath = helpers.getShortPathFromFullPath(app, o.path);
    o.normalizedShortPath = helpers.getNormalizedShortPath(app, o.shortPath);
  }

  if (o.children) {
    o.variations = getVariations(app, o);
    o.children = o.children.map((child) => updateSourceObject(app, child));
  }

  return o;
}

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
