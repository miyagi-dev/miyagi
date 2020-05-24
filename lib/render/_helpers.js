"use strict";

const config = require("../config.json");
const helpers = require("../helpers.js");
const log = require("../logger.js");
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
  const [shortVal, variation] = value.$ref.split("#");
  const val = `${shortVal}/${app.get("config").files.mocks.name}.${
    app.get("config").files.mocks.extension
  }`;
  const jsonFromData = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(app, val)
  ];

  if (jsonFromData) {
    let embeddedJson = jsonFromData;
    let variantJson = {};
    const rootJson = embeddedJson.data || {};

    if (
      variation &&
      embeddedJson.variations &&
      embeddedJson.variations.length
    ) {
      const variant = embeddedJson.variations.find((vari) => {
        if (vari.name) {
          return (
            helpers.normalizeString(vari.name) ===
            helpers.normalizeString(variation)
          );
        } else {
          return false;
        }
      });

      if (variant) {
        variantJson = variant && variant.data ? variant.data : {};
      } else {
        log(
          "warn",
          config.messages.variationNotFound
            .replace("${variation}", variation)
            .replace("${fileName}", val)
        );
      }
    }

    return Object.assign({}, rootJson, variantJson);
  } else {
    log(
      "warn",
      config.messages.fileNotFoundLinkIncorrect.replace("${filePath}", val)
    );
    return {};
  }
}

function overwriteAttributesKey(app, data) {
  if (data) {
    const entries = Object.entries(data);
    for (const [key, val] of entries) {
      if (key == "attributes()") {
        let str = "";

        const valEntries = Object.entries(val);
        for (const [attr, value] of valEntries) {
          let renderedValue = "";

          if (value instanceof Array) {
            for (const entry of value) {
              renderedValue += `${entry} `;
            }
          } else {
            renderedValue = value;
          }

          str += ` ${attr}="${renderedValue}"`;
        }

        data = str;
      } else if (typeof val !== "string") {
        data[key] = overwriteAttributesKey(app, val);
      }
    }
  }

  return data;
}

function overwriteRenderKey(app, data) {
  if (data) {
    const entries = Object.entries(data);
    for (const [key, val] of entries) {
      if (key == "render()") {
        let str = "";

        for (const html of val) {
          str += html;
        }

        data = str;
      } else if (typeof val !== "string") {
        data[key] = overwriteRenderKey(app, val);
      }
    }
  }

  return data;
}

function resolveTpl(app, entry) {
  return new Promise((resolve1) => {
    if (entry) {
      if (Array.isArray(entry)) {
        return resolve1(entry);
      } else if (typeof entry === "string") {
        return resolve1(entry);
      } else if (entry["render()"]) {
        const arr = [];
        const entries = entry["render()"];
        for (const item of entries) {
          arr.push(
            new Promise(async (resolve) => {
              resolveTpl(app, item).then((result) => resolve(result));
            })
          );
        }
        Promise.all(arr).then((res) => {
          resolve1({
            "render()": res,
          });
        });
      } else if (entry.$tpl) {
        const promises = [];
        let html;

        const data = Object.assign({}, entry);
        delete data.$tpl;

        const entries = Object.keys(data);
        for (const item of entries) {
          promises.push(
            new Promise((resolve2) => {
              if (data[item] instanceof Array) {
                const arr = [];
                for (const dataItem of data[item]) {
                  arr.push(
                    new Promise((resolve3) => {
                      resolveTpl(app, Object.assign({}, dataItem)).then(
                        (response) => {
                          resolve3(response);
                        }
                      );
                    })
                  );
                }
                Promise.all(arr).then((array) => {
                  data[item] = array;
                  resolve2();
                });
              } else if (data[item].$tpl) {
                resolveTpl(app, Object.assign({}, data[item])).then(
                  (response) => {
                    data[item] = response;
                    resolve2();
                  }
                );
              } else {
                resolve2();
              }
            })
          );
        }

        return Promise.all(promises).then(() => {
          const filePath = `${entry.$tpl}/${
            app.get("config").files.templates.name
          }.${app.get("config").files.templates.extension}`;
          app.render(
            filePath,
            getDataForRenderFunction(app, data),
            (err, html) => {
              if (err)
                log(
                  "warn",
                  config.messages.renderingTemplateFailed
                    .replace("${filePath}", filePath)
                    .replace("${engine}", app.get("config").engine.name)
                );
              resolve1(html);
            }
          );
        });
      }
    }

    return resolve1(entry);
  });
}

async function resolveJson(app, entry) {
  if (entry !== null) {
    if (Array.isArray(entry)) {
      return entry;
    } else if (typeof entry === "string") {
      return entry;
    } else if (entry["render()"]) {
      const arr = [];
      const entries = entry["render()"];
      for (let i = 0, len = entries.length; i < 0; i++) {
        const item = entries[i];
        new Promise(async (resolve) => {
          arr[i] = await resolveJson(app, item);
          resolve();
        });
      }
      return Promise.all(arr).then(() => {
        return {
          "render()": arr,
        };
      });
    } else if (entry.$ref) {
      let dataWithoutComponentAndVariation = cloneDeep(entry);
      let resolvedJson = getRootOrVariantData(app, {
        $ref: entry.$ref,
      });
      delete dataWithoutComponentAndVariation.$ref;

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
  const fullPath = path.join(
    process.cwd(),
    app.get("config").components.folder
  );

  return Object.assign({}, data, {
    path: fullPath,
    allowInlineIncludes: true,
    namespaces: app.get("config").engine.namespaces, // for twig
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
  overwriteRenderKey,
  overwriteAttributesKey,
};
