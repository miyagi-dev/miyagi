/**
 * Helper functions for the render module
 * @module render/helpers
 */

const path = require("path");
const deepMerge = require("deepmerge");
const config = require("../config.json");
const helpers = require("../helpers.js");
const log = require("../logger.js");

async function extendTemplateData(config, data, filePath) {
  let o = {};

  for (const plugin of config.plugins) {
    if (plugin.extendTemplateData) {
      o = deepMerge(
        o,
        await plugin.extendTemplateData(
          path.join(config.components.folder, filePath)
        )
      );
    }
  }

  return deepMerge(data, o);
}

async function resolveData(app, data, rootData) {
  if (rootData) {
    data = mergeRootDataWithVariationData(rootData, data);
  }
  data = await overwriteJsonLinksWithJsonData(app, data);
  data = mergeWithGlobalData(app, data);
  data = await overwriteTplLinksWithTplContent(app, data);
  data = await overwriteRenderKey(app, data);

  return data;
}

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
    const embeddedJson = jsonFromData;
    let variantJson = {};
    const rootJson = helpers.removeInternalKeys(embeddedJson);

    if (
      variation &&
      embeddedJson.$variations &&
      embeddedJson.$variations.length
    ) {
      const variant = embeddedJson.$variations.find((vari) => {
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
      } else if (typeof val !== "string" && typeof val !== "number") {
        o[key] = overwriteRenderKey(app, val);
      }
    }
  }

  return o;
}

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

      if (typeof entry === "string" || typeof entry === "number") {
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
          data = await extendTemplateData(app.get("config"), data, filePath);

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
        } else {
          entries = await overwriteRenderKey(app, entries);
          resolve1(entries);
        }
      });
    }

    return resolve1(entry);
  });
}

async function resolveJson(app, entry) {
  if (entry !== null) {
    if (Array.isArray(entry)) {
      return entry;
    }

    if (typeof entry === "string" || typeof entry === "number") {
      return entry;
    }

    if (entry.$ref) {
      const dataWithoutComponentAndVariation = helpers.cloneDeep(entry);
      const resolvedJson = getRootOrVariantData(app, {
        $ref: entry.$ref,
      });
      delete dataWithoutComponentAndVariation.$ref;

      return deepMerge(resolvedJson, dataWithoutComponentAndVariation);
    }
  }

  return entry;
}

async function iterateOverTplData(app, data) {
  if (data) {
    if (typeof data === "string" || typeof data === "number") {
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

async function overwriteTplLinksWithTplContent(app, data) {
  return new Promise((resolve) => iterateOverTplData(app, data).then(resolve));
}

async function iterateOverJsonData(app, data) {
  if (data) {
    if (typeof data === "string" || typeof data === "number") {
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

async function overwriteJsonLinksWithJsonData(app, data) {
  return new Promise((resolve) => iterateOverJsonData(app, data).then(resolve));
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
};
