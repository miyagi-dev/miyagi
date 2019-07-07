"use strict";

const config = require("../config.json");
const helpers = require("../helpers.js");
const fs = require("fs");
const path = require("path");
const deepMerge = require("deepmerge");
const cloneDeep = require("clone-deep");

function getComponentErrorHtml(err) {
  return `<p class="RoundupError">${
    err === null ? config.messages.componentCouldNotBeRendered : err
  }</p>`;
}

function getRootOrVariantData(req, value) {
  const val = value.component || value;

  let embeddedJson = req.app.get("state").data[
    helpers.getFullPathFromShortPath(req.app, val)
  ];

  if (
    value.variation &&
    embeddedJson.variations &&
    embeddedJson.variations.length
  ) {
    const variant = embeddedJson.variations.filter(
      variation => variation.name === value.variation
    )[0];
    return variant && variant.data ? variant.data : {};
  } else {
    return embeddedJson.data;
  }
}

async function resolveJson(req, entry) {
  if (entry instanceof Array) {
    return entry;
  } else if (typeof entry === "string") {
    if (helpers.fileIsDataFile(entry)) {
      return getRootOrVariantData(req, entry);
    } else {
      return entry;
    }
  } else if (entry !== null && typeof entry === "object") {
    if (entry.component) {
      if (helpers.fileIsDataFile(entry.component)) {
        let dataWithoutComponentAndVariation = cloneDeep(entry);
        let resolvedJson = getRootOrVariantData(req, {
          component: entry.component,
          variation: entry.variation
        });

        delete dataWithoutComponentAndVariation.component;
        delete dataWithoutComponentAndVariation.variation;

        return deepMerge(resolvedJson, entry);
      } else {
        return entry;
      }
    }
  }

  return entry;
}

async function iterateOverJsonData(req, data) {
  if (typeof data === "object") {
    await Promise.all(
      Object.keys(data).map(async key => {
        data[key] = await resolveJson(req, data[key]);
        await iterateOverJsonData(req, data[key]);
        return data[key];
      })
    );
  }

  return data;
}

async function overwriteJsonLinksWithJsonData(req, data) {
  return new Promise(async resolve => {
    resolve(await iterateOverJsonData(req, data));
  });
}

function mergeRootDataWithVariationData(rootData, variationData) {
  if (!rootData) {
    return variationData;
  }

  if (!variationData) {
    return rootData;
  }

  return deepMerge(rootData, variationData);
}

function getAssetPath(req, component, type) {
  const assetPath = `${req.app.get("config").srcFolder}${component.slice(
    0,
    component.lastIndexOf(req.app.get("config").extension)
  )}${type}`;

  return fs.existsSync(assetPath) ? assetPath : null;
}

function getDataForRenderFunction(req, data) {
  return Object.assign({}, data, {
    partials: req.app.get("state").partials,
    basedir: path.join(process.cwd(), req.app.get("config").srcFolder), // for pug
    root: path.join(process.cwd(), req.app.get("config").srcFolder), // for ect
    settings: {
      views: path.join(process.cwd(), req.app.get("config").srcFolder) // for dust
    }
  });
}

module.exports = {
  getAssetPath,
  getComponentErrorHtml,
  getDataForRenderFunction,
  mergeRootDataWithVariationData,
  overwriteJsonLinksWithJsonData
};
