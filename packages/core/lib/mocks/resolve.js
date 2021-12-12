const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const deepMerge = require("deepmerge");
const fileStat = promisify(fs.stat);
const config = require("../config.json");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const {
  extendTemplateData,
  getDataForRenderFunction,
} = require("../render/helpers");

module.exports =
  /**
   * @param {object} app - the express instance
   * @param {object} data - the mock data object that will be passed into the component
   * @param {object} [rootData] - the root mock data object
   * @returns {Promise<object>} the resolved data object
   */
  async function resolveData(app, data, rootData) {
    let merged = rootData
      ? mergeRootDataWithVariationData(rootData, data)
      : data;
    let resolved;

    merged = mergeWithGlobalData(app, merged);
    resolved = await overwriteJsonLinksWithJsonData(app, merged);
    resolved = await overwriteTplLinksWithTplContent(app, resolved);
    resolved = await overwriteRenderKey(app, resolved);

    return { merged, resolved };
  };

/**
 * @param {object} app - the express instance
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {Promise} gets resolved with resolved data object
 */
async function overwriteJsonLinksWithJsonData(app, data) {
  return new Promise((resolve) => iterateOverJsonData(app, data).then(resolve));
}

/**
 * @param {object} app - the express instance
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {Promise} gets resolved with resolved data object
 */
async function overwriteTplLinksWithTplContent(app, data) {
  return new Promise((resolve) => iterateOverTplData(app, data).then(resolve));
}

/**
 * @param {object} app - the express instance
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function iterateOverTplData(app, entry) {
  if (entry) {
    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean" ||
      entry === null
    ) {
      return entry;
    }

    if (entry instanceof Array) {
      const o = [];
      const promises = [];

      entry.forEach((entry, i) => {
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

    const o = { ...entry };

    await Promise.all(
      Object.keys(o).map(async (key) => {
        o[key] = await resolveTpl(app, o[key]);
        o[key] = await iterateOverTplData(app, o[key]);
        return o[key];
      })
    );

    return o;
  }

  return entry;
}

/**
 * @param {object} app - the express instance
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function iterateOverJsonData(app, entry) {
  if (entry) {
    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean" ||
      entry === null
    ) {
      return entry;
    }

    if (entry instanceof Array) {
      const o = [];
      const promises = [];

      entry.forEach((entry, i) => {
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

    let o = {};

    await Promise.all(
      Object.entries({ ...entry }).map(async ([key, value]) => {
        if (key === "$ref") {
          o = { ...o, ...(await getRootOrVariantDataOfReference(app, value)) };
        } else {
          const resolvedValue = await iterateOverJsonData(
            app,
            await resolveJson(app, value)
          );

          o[key] = resolvedValue;
        }

        return true;
      })
    );

    return o;
  }

  return entry;
}

/**
 * @param {object} app - the express instance
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise} gets resolved with the resolved value from the mock data object
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
              resolveTpl(app, o).then((res) => {
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
        typeof entry === "boolean" ||
        entry === null
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
          let filePath;
          let fullFilePath;

          if (entries.$tpl.startsWith("@")) {
            const namespace = entries.$tpl.split("/")[0];
            const resolvedNamespace =
              app.get("config").engine.options.namespaces[namespace.slice(1)];

            const stat = await fileStat(path.resolve(resolvedNamespace));

            if (stat.isSymbolicLink()) {
              filePath = `${entries.$tpl.replace(
                namespace,
                resolvedNamespace.replace(
                  path.join(app.get("config").components.folder, "/"),
                  ""
                ),
                ""
              )}/${helpers.getResolvedFileName(
                app.get("config").files.templates.name,
                path.basename(entries.$tpl)
              )}.${app.get("config").files.templates.extension}`;

              fullFilePath = helpers.getFullPathFromShortPath(app, filePath);
            } else {
              filePath = `${entries.$tpl.replace(
                namespace,
                resolvedNamespace.replace(
                  app.get("config").components.folder,
                  ""
                ),
                ""
              )}/${helpers.getResolvedFileName(
                app.get("config").files.templates.name,
                path.basename(entries.$tpl)
              )}.${app.get("config").files.templates.extension}`.slice(1);
            }

            fullFilePath = helpers.getFullPathFromShortPath(app, filePath);
          } else {
            filePath = `${entries.$tpl}/${helpers.getResolvedFileName(
              app.get("config").files.templates.name,
              path.basename(entries.$tpl)
            )}.${app.get("config").files.templates.extension}`;

            fullFilePath = helpers.getFullPathFromShortPath(app, filePath);
          }

          fs.stat(fullFilePath, async function (err) {
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
          });
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
 * @param {object|Array|string|boolean} entry - a value from the mock data object
 * @returns {Promise<object|Array|string|boolean>} the resolved value from the mock data object
 */
async function resolveJson(app, entry) {
  if (entry !== null) {
    if (Array.isArray(entry)) {
      return entry;
    }

    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean" ||
      entry === null
    ) {
      return entry;
    }

    if (entry === undefined) {
      log("warn", config.messages.referencedMockFileNotFound);
      return entry;
    }

    if (entry.$ref) {
      const customData = helpers.cloneDeep(entry);
      delete customData.$ref;

      const resolvedJson = await getRootOrVariantDataOfReference(
        app,
        entry.$ref
      );

      return deepMerge(resolvedJson, customData);
    }
  }

  return entry;
}

/**
 * @param {object} app - the express instance
 * @param {string} ref - the reference to another mock data
 * @returns {object} the resolved data object
 */
async function getRootOrVariantDataOfReference(app, ref) {
  let [shortVal, variation] = ref.split("#");
  let val;

  if (shortVal.startsWith("@")) {
    const namespace = shortVal.split("/")[0];
    const resolvedNamespace =
      app.get("config").engine.options.namespaces[namespace.slice(1)];
    const stat = await fileStat(path.resolve(resolvedNamespace));

    if (stat.isSymbolicLink()) {
      shortVal = shortVal.replace(
        namespace,
        resolvedNamespace.replace(
          path.join(app.get("config").components.folder, "/"),
          ""
        ),
        ""
      );
    } else {
      shortVal = shortVal.replace(
        namespace,
        resolvedNamespace.replace(app.get("config").components.folder, ""),
        ""
      );
    }
  }

  val = `${shortVal}/${app.get("config").files.mocks.name}.${
    app.get("config").files.mocks.extension
  }`;
  const jsonFromData =
    app.get("state").fileContents[helpers.getFullPathFromShortPath(app, val)];

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

    return deepMerge(helpers.cloneDeep(rootJson), variantJson);
  }
  log(
    "warn",
    config.messages.fileNotFoundLinkIncorrect.replace("{{filePath}}", val)
  );

  return {};
}

/**
 * @param {object} app - the express instance
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {object} the resolved data object
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
          typeof val === "boolean" ||
          val === null
        ) {
          o[key] = val;
        } else if (Array.isArray(val)) {
          val.forEach((v, i) => {
            if (
              typeof v == "string" ||
              typeof v === "number" ||
              typeof v === "boolean" ||
              val === null
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
 * @param {object} rootData - the root mock data of a component
 * @param {object} variationData - a variation mock data of a component
 * @returns {object} the merged data
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
 * @param {object} data - the mock data object that will be passed into the component
 * @returns {object} the merged data object
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
