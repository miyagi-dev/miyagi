/**
 * Helper functions for the render module
 *
 * @module render/helpers
 */

const fs = require("fs");
const path = require("path");
const deepMerge = require("deepmerge");
const config = require("../config.json");
const helpers = require("../helpers.js");
const log = require("../logger.js");

/**
 * @param config
 * @param data
 * @param filePath
 */
async function extendTemplateData(config, data, filePath) {
  let o = {};
  let fullFilePath = filePath.endsWith(config.files.templates.extension)
    ? filePath
    : `${filePath}/${path.basename(filePath)}.${
        config.files.templates.extension
      }`;

  for (const extension of config.extensions) {
    if (extension.extendTemplateData) {
      o = deepMerge(
        o,
        await extension.extendTemplateData(
          path.join(config.components.folder, fullFilePath)
        )
      );
    }
  }

  return deepMerge(data, o);
}

/**
 * @param {object} app - the express instance
 * @param data
 * @param rootData
 */
async function resolveData(app, data, rootData) {
  data = await overwriteJsonLinksWithJsonData(app, data);
  data = await overwriteTplLinksWithTplContent(app, data);
  data = await overwriteRenderKey(app, data);

  if (rootData) {
    rootData = await overwriteJsonLinksWithJsonData(app, rootData);
    rootData = await overwriteTplLinksWithTplContent(app, rootData);
    rootData = await overwriteRenderKey(app, rootData);
    data = mergeRootDataWithVariationData(rootData, data);
  }

  data = mergeWithGlobalData(app, data);

  return data;
}

/**
 * @param {object} app - the express instance
 * @param data
 */
function getDataForRenderFunction(app, data) {
  const fullPath = path.join(
    process.cwd(),
    app.get("config").components.folder
  );

  return {
    ...data,
    path: fullPath,
    partials: app.get("state").partials,
    basedir: fullPath, // for pug
    root: fullPath, // for ect
    settings: {
      views: fullPath, // for dust
    },
    ...app.get("config").engine.options,
  };
}

/**
 * @param {object} app - the express instance
 * @param data
 */
function mergeWithGlobalData(app, data) {
  return {
    ...app.get("state").fileContents[
      helpers.getFullPathFromShortPath(
        app,
        `data.${app.get("config").files.mocks.extension}`
      )
    ],
    ...data,
  };
}

/**
 * @param variations
 * @param rootData
 */
function getFallbackData(variations, rootData) {
  for (let i = 0; i < variations.length; i += 1) {
    const variationData = helpers.removeInternalKeys(variations[i]);

    if (Object.keys(variationData).length > 0) {
      if (rootData) {
        return { ...rootData, ...variationData };
      }

      return variationData;
    }
  }

  return {};
}

/**
 * @param err
 */
function getComponentErrorHtml(err) {
  return `<p class="MiyagiError">${
    err === null ? config.messages.componentCouldNotBeRendered : err
  }</p>`;
}

/**
 * @param {object} app - the express instance
 * @param value
 */
function getRootOrVariantData(app, value) {
  const [shortVal, variation] = value.$ref.split("#");
  const val = `${shortVal}/${app.get("config").files.mocks.name}.${
    app.get("config").files.mocks.extension
  }`;
  const jsonFromData = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(app, val)
  ];

  if (jsonFromData) {
    const embeddedJson = jsonFromData;
    let variantJson = {};
    const rootJson = helpers.removeInternalKeys(embeddedJson);

    if (variation && embeddedJson.$variants && embeddedJson.$variants.length) {
      const variant = embeddedJson.$variants.find((vari) => {
        if (vari.$name) {
          return (
            helpers.normalizeString(vari.$name) ===
            helpers.normalizeString(variation)
          );
        }
        return false;
      });

      if (variant) {
        variantJson = helpers.removeInternalKeys(variant);
      } else {
        log(
          "warn",
          config.messages.variationNotFound
            .replace("{{variation}}", variation)
            .replace("{{fileName}}", val)
        );
      }
    }

    return { ...rootJson, ...variantJson };
  }
  log(
    "warn",
    config.messages.fileNotFoundLinkIncorrect.replace("{{filePath}}", val)
  );
  return {};
}

/**
 * @param {object} app - the express instance
 * @param data
 */
function overwriteRenderKey(app, data) {
  let o;

  if (data) {
    o = { ...data };
    const entries = Object.entries(o);
    for (const [key, val] of entries) {
      if (key === "$render") {
        let str = "";

        for (const html of val) {
          str += html;
        }

        o = str;
      } else {
        if (
          typeof val == "string" ||
          typeof val === "number" ||
          typeof val === "boolean"
        ) {
          o[key] = val;
        } else if (Array.isArray(val)) {
          val.forEach((v, i) => {
            if (
              typeof v == "string" ||
              typeof v === "number" ||
              typeof v === "boolean"
            ) {
              o[key][i] = v;
            } else {
              o[key][i] = overwriteRenderKey(app, v);
            }
          });
        } else {
          o[key] = overwriteRenderKey(app, val);
        }
      }
    }
  }

  return o;
}

/**
 * @param {object} app - the express instance
 * @param entry
 */
function resolveTpl(app, entry) {
  return new Promise((resolve1) => {
    if (entry) {
      if (Array.isArray(entry)) {
        const promises = [];
        const arr = [...entry];

        arr.forEach((o, i) => {
          promises.push(
            new Promise((resolve) => {
              resolveTpl(app, o, true).then((res) => {
                arr[i] = res;
                resolve();
              });
            })
          );
        });

        return Promise.all(promises).then(() => {
          resolve1(arr);
        });
      }

      if (
        typeof entry === "string" ||
        typeof entry === "number" ||
        typeof entry === "boolean"
      ) {
        return resolve1(entry);
      }

      const promises = [];
      let entries = { ...entry };

      Object.entries(entries).forEach(async ([key, val]) => {
        if (key !== "$tpl") {
          promises.push(
            new Promise((resolve) => {
              resolveTpl(app, val).then((result) => {
                entries[key] = result;
                resolve();
              });
            })
          );
        }
      });

      return Promise.all(promises).then(async () => {
        if (entries.$tpl) {
          let data = { ...entries };
          delete data.$tpl;
          const filePath = `${entries.$tpl}/${helpers.getResolvedFileName(
            app.get("config").files.templates.name,
            path.basename(entries.$tpl)
          )}.${app.get("config").files.templates.extension}`;

          fs.stat(
            helpers.getFullPathFromShortPath(app, filePath),
            async function (err) {
              if (err == null) {
                data = await extendTemplateData(
                  app.get("config"),
                  data,
                  filePath
                );

                await app.render(
                  filePath,
                  getDataForRenderFunction(app, data),
                  (err, html) => {
                    if (err)
                      log(
                        "warn",
                        config.messages.renderingTemplateFailed
                          .replace("{{filePath}}", filePath)
                          .replace("{{engine}}", app.get("config").engine.name)
                      );

                    resolve1(html);
                  }
                );
              } else if (err.code === "ENOENT") {
                const msg = config.messages.templateDoesNotExist.replace(
                  "{{template}}",
                  filePath
                );
                log("error", msg);
                resolve1(msg);
              }
            }
          );
        } else {
          entries = await overwriteRenderKey(app, entries);
          resolve1(entries);
        }
      });
    }

    return resolve1(entry);
  });
}

/**
 * @param {object} app - the express instance
 * @param entry
 */
async function resolveJson(app, entry) {
  if (entry !== null) {
    if (Array.isArray(entry)) {
      return entry;
    }

    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean"
    ) {
      return entry;
    }

    if (entry.$ref) {
      const customData = helpers.cloneDeep(entry);
      delete customData.$ref;

      const resolvedJson = getRootOrVariantData(app, {
        $ref: entry.$ref,
      });

      return deepMerge(resolvedJson, customData);
    }
  }

  return entry;
}

/**
 * @param {object} app - the express instance
 * @param data
 */
async function iterateOverTplData(app, data) {
  if (data) {
    if (
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean"
    ) {
      return data;
    }

    if (data instanceof Array) {
      const o = [];
      const promises = [];

      data.forEach((entry, i) => {
        promises.push(
          new Promise((resolve) => {
            resolveTpl(app, entry)
              .then((result) => iterateOverTplData(app, result))
              .then((result) => {
                o[i] = result;
                resolve();
              });
          })
        );
      });

      return Promise.all(promises).then(() => {
        return o;
      });
    }

    const o = { ...data };

    await Promise.all(
      Object.keys(o).map(async (key) => {
        o[key] = await resolveTpl(app, o[key]);
        o[key] = await iterateOverTplData(app, o[key]);
        return o[key];
      })
    );

    return o;
  }

  return data;
}

/**
 * @param {object} app - the express instance
 * @param data
 */
async function overwriteTplLinksWithTplContent(app, data) {
  return new Promise((resolve) => iterateOverTplData(app, data).then(resolve));
}

/**
 * @param {object} app - the express instance
 * @param data
 */
async function iterateOverJsonData(app, data) {
  if (data) {
    if (
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean"
    ) {
      return data;
    }

    if (data instanceof Array) {
      const o = [];
      const promises = [];

      data.forEach((entry, i) => {
        promises.push(
          new Promise((resolve) => {
            resolveJson(app, entry)
              .then((result) => iterateOverJsonData(app, result))
              .then((result) => {
                o[i] = result;
                resolve();
              });
          })
        );
      });

      return Promise.all(promises).then(() => {
        return o;
      });
    }

    const o = { ...data };

    await Promise.all(
      Object.keys(o).map(async (key) => {
        o[key] = await resolveJson(app, o[key]);
        o[key] = await iterateOverJsonData(app, o[key]);
        return o[key];
      })
    );

    return o;
  }

  return data;
}

/**
 * @param {object} app - the express instance
 * @param data
 */
async function overwriteJsonLinksWithJsonData(app, data) {
  return new Promise((resolve) => iterateOverJsonData(app, data).then(resolve));
}

/**
 * @param rootData
 * @param variationData
 */
function mergeRootDataWithVariationData(rootData, variationData) {
  if (!rootData) {
    return variationData;
  }

  if (!variationData) {
    return rootData;
  }

  return deepMerge(rootData, variationData);
}

/**
 * @param {object} app - the express instance
 * @param directoryPath
 */
function getTemplateFilePathFromDirectoryPath(app, directoryPath) {
  return path.join(
    directoryPath,
    `${helpers.getResolvedFileName(
      app.get("config").files.templates.name,
      path.basename(directoryPath)
    )}.${app.get("config").files.templates.extension}`
  );
}

module.exports = {
  extendTemplateData,
  resolveData,
  getComponentErrorHtml,
  getDataForRenderFunction,
  getFallbackData,
  mergeRootDataWithVariationData,
  mergeWithGlobalData,
  overwriteJsonLinksWithJsonData,
  overwriteTplLinksWithTplContent,
  overwriteRenderKey,
  getTemplateFilePathFromDirectoryPath,
};
