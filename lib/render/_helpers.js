"use strict";

const config = require("../config.json");
const helpers = require("../helpers.js");
const logger = require("../logger.js");
const path = require("path");
const deepMerge = require("deepmerge");
const cloneDeep = require("clone-deep");

function mergeWithGlobalData(app, data) {
  return Object.assign(
    {},
    app.get("state").fileContents[
      helpers.getFullPathFromShortPath(app, "data.json")
    ],
    data
  );
}

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
  const val = value.dataFile;
  const jsonFromData = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(app, val)
  ];

  if (jsonFromData) {
    let embeddedJson = jsonFromData;

    if (
      value.variation &&
      embeddedJson.variations &&
      embeddedJson.variations.length
    ) {
      const variant = embeddedJson.variations.find(
        (variation) => variation.name === value.variation
      );
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

function resolveTpl(app, entry) {
  return new Promise((resolve) => {
    if (entry !== null) {
      if (Array.isArray(entry)) {
        return resolve(entry);
      } else if (typeof entry === "string") {
        return resolve(entry);
      } else if (entry.tplFile) {
        const promises = [];
        let html;

        const data = Object.assign({}, entry.data || entry);

        delete data.tplFile;

        Object.keys(data).forEach(async (item) => {
          promises.push(
            new Promise((res) => {
              if (data[item].tplFile) {
                resolveTpl(app, Object.assign({}, data[item])).then(
                  (response) => {
                    data[item] = response;
                    res();
                  }
                );
              } else {
                res();
              }
            })
          );
        });

        return Promise.all(promises).then(() => {
          const filePath = `${entry.tplFile}/${entry.tplFile
            .split(path.sep)
            .slice(-1)}.${app.get("config").extension}`;
          app.render(
            filePath,
            getDataForRenderFunction(app, data),
            (err, html) => {
              if (err)
                logger.log(
                  "warn",
                  config.messages.renderingTemplateFailed
                    .replace("${filePath}", filePath)
                    .replace("${engine}", app.get("config").engine)
                );
              resolve(html);
            }
          );
        });
      }
    }

    return resolve(entry);
  });
}

async function resolveJson(app, entry) {
  if (entry !== null) {
    if (Array.isArray(entry)) {
      return entry;
    } else if (typeof entry === "string") {
      return entry;
    } else if (entry.dataFile) {
      let dataWithoutComponentAndVariation = cloneDeep(entry);
      let resolvedJson = getRootOrVariantData(app, {
        dataFile: `${entry.dataFile}/${entry.dataFile
          .split(path.sep)
          .slice(-1)}.${config.dataFileType}`,
        variation: entry.variation,
      });

      delete dataWithoutComponentAndVariation.dataFile;
      delete dataWithoutComponentAndVariation.variation;

      return deepMerge(resolvedJson, dataWithoutComponentAndVariation);
    }
  }

  return entry;
}

async function iterateOverTplData(app, data) {
  if (data && typeof data === "object") {
    await Promise.all(
      Object.keys(data).map(async (key) => {
        data[key] = await resolveTpl(app, data[key]);
        await iterateOverTplData(app, data[key]);
        return data[key];
      })
    );
  }

  return data;
}

async function overwriteTplLinksWithTplContent(app, data) {
  return new Promise(async (resolve) => {
    resolve(await iterateOverTplData(app, data));
  });
}

async function iterateOverJsonData(app, data) {
  if (data && typeof data === "object") {
    await Promise.all(
      Object.keys(data).map(async (key) => {
        data[key] = await resolveJson(app, data[key]);
        await iterateOverJsonData(app, data[key]);
        return data[key];
      })
    );
  }

  return data;
}

async function overwriteJsonLinksWithJsonData(app, data) {
  return new Promise(async (resolve) => {
    resolve(await iterateOverJsonData(app, data));
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

function getDataForRenderFunction(app, data) {
  const fullPath = path.join(process.cwd(), app.get("config").srcFolder);

  return Object.assign({}, data, {
    path: fullPath,
    allowInlineIncludes: true,
    namespaces: app.get("config").namespaces, // for twig
    partials: app.get("state").partials,
    basedir: fullPath, // for pug
    root: fullPath, // for ect
    settings: {
      views: fullPath, // for dust
    },
  });
}

module.exports = {
  getComponentErrorHtml,
  getDataForRenderFunction,
  getFallbackData,
  mergeRootDataWithVariationData,
  mergeWithGlobalData,
  overwriteJsonLinksWithJsonData,
  overwriteTplLinksWithTplContent,
};
