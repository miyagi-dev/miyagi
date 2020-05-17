"use strict";

const path = require("path");
const config = require("../../config.json");
const logger = require("../../logger.js");
const helpers = require("../../helpers.js");

function handleFileResult(app, json, obj, fullPath) {
  obj.variations = [];

  if (json) {
    const { variations } = json;

    if (json.data) {
      obj.variations.push({
        name: config.defaultVariationName,
        data: json.data,
      });
    }

    if (variations && variations.length > 0) {
      obj.variations = [...obj.variations, ...variations];
    }

    obj.variations = obj.variations.filter((variation, i) => {
      if (variation.name && variation.data) {
        return variation;
      } else {
        if (fullPath) {
          const shortPath = helpers.getShortPathFromFullPath(app, fullPath);
          if (!variation.name) {
            logger.log(
              "warn",
              config.messages.noNameSetForVariation
                .replace("${i}", i)
                .replace("${file}", shortPath)
            );
          } else {
            logger.log(
              "warn",
              config.messages.noDataSetForVariation
                .replace("${variation}", variation.name)
                .replace("${file}", shortPath)
            );
          }
        }
        return false;
      }
    });
  } else {
    obj.variations.push({
      name: config.defaultVariationName,
      data: {},
    });
  }
  return obj;
}

function getData(app, obj, jsonChild) {
  const fullPath = jsonChild.path;
  let result;

  if (app.get("state").fileContents[fullPath]) {
    result = app.get("state").fileContents[fullPath];
  }

  return handleFileResult(app, result, obj, fullPath);
}

function addVariations(app, obj) {
  const tplChild = obj.children.find(
    (o) =>
      o.name ===
      `${app.get("config").files.templates.name}.${
        app.get("config").files.templates.extension
      }`
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
  } else {
    return obj;
  }
}

function updateSourceObject(app, obj) {
  if (obj.path) {
    obj.shortPath = helpers.getShortPathFromFullPath(app, obj.path);
    obj.normalizedShortPath = helpers.getNormalizedShortPath(
      app,
      obj.shortPath
    );
  }

  if (obj.children) {
    obj = addVariations(app, obj);

    obj.children.map((child) => {
      updateSourceObject(app, child);
    });
  }

  return obj;
}

module.exports = function(app) {
  const result = updateSourceObject(app, app.get("state").sourceTree);

  (function loop(obj, index) {
    obj.index = index;
    delete obj.size;

    if (obj.children) {
      obj.children.forEach((child) => {
        const newIndex = child.type === "directory" ? index + 1 : index;
        loop(child, newIndex);
      });
    }
  })(result, -1);

  return result && result.children ? result.children : [];
};
