"use strict";

const config = require("../config.json");
const helpers = require("../helpers.js");
const logger = require("../logger.js");
const path = require("path");
const deepMerge = require("deepmerge");
const cloneDeep = require("clone-deep");

function getFallbackData(variations) {
  for (let i = 0; i < variations.length; i += 1) {
    if (variations[i].data) {
      return variations[i].data;
    }
  }

  return {};
}

function getComponentErrorHtml(err) {
  return `<p class="HeadmanError">${
    err === null ? config.messages.componentCouldNotBeRendered : err
  }</p>`;
}

function getRootOrVariantData(app, value) {
  const val = value.component;
  const jsonFromData = app.get("state").data[
    helpers.getFullPathFromShortPath(app, val)
  ];

  if (jsonFromData) {
    let embeddedJson = jsonFromData;

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
  } else {
    logger.log(
      "warn",
      config.messages.fileNotFoundLinkIncorrect.replace("${filePath}", val)
    );
    return {};
  }
}

async function resolveJson(app, entry) {
  if (entry !== null) {
    if (entry instanceof Array) {
      return entry;
    } else if (typeof entry === "string") {
      return entry;
    } else {
      if (entry.component) {
        if (helpers.fileIsDataFile(entry.component)) {
          let dataWithoutComponentAndVariation = cloneDeep(entry);
          let resolvedJson = getRootOrVariantData(app, {
            component: entry.component,
            variation: entry.variation
          });

          delete dataWithoutComponentAndVariation.component;
          delete dataWithoutComponentAndVariation.variation;

          return deepMerge(resolvedJson, dataWithoutComponentAndVariation);
        } else {
          logger.log(
            "warn",
            config.messages.wrongFileType.replace(
              "${fileName}",
              entry.component
            )
          );

          delete entry.component;
          return entry;
        }
      }
    }
  }

  return entry;
}

async function iterateOverJsonData(app, data) {
  if (data && typeof data === "object") {
    await Promise.all(
      Object.keys(data).map(async key => {
        data[key] = await resolveJson(app, data[key]);
        await iterateOverJsonData(app, data[key]);
        return data[key];
      })
    );
  }

  return data;
}

async function overwriteJsonLinksWithJsonData(req, data) {
  return new Promise(async resolve => {
    resolve(await iterateOverJsonData(req.app, data));
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

function getDataForRenderFunction(req, data) {
  const fullPath = path.join(process.cwd(), req.app.get("config").srcFolder);

  return Object.assign({}, data, {
    partials: req.app.get("state").partials,
    basedir: fullPath, // for pug
    root: fullPath, // for ect
    settings: {
      views: fullPath // for dust
    }
  });
}

module.exports = {
  getComponentErrorHtml,
  getDataForRenderFunction,
  getFallbackData,
  mergeRootDataWithVariationData,
  overwriteJsonLinksWithJsonData
};
