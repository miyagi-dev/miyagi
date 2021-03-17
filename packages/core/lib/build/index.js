const fs = require("fs-extra");
const path = require("path");
const helpers = require("../helpers.js");
const render = require("../render/index.js");
const log = require("../logger.js");
const appConfig = require("../config.json");

/**
 * Module for creating a static build
 *
 * @module build
 * @param {object} app - the express instance
 */
module.exports = (app) => {
  const config = { ...app.get("config") };
  const { build } = config;
  const buildFolder = build.folder;
  const date = new Date();
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const buildDate = `${utcDate.getFullYear()}-${(utcDate.getMonth() + 1)
    .toString()
    .padStart(
      2,
      "0"
    )}-${utcDate.getDate()} ${utcDate.getHours()}:${utcDate.getMinutes()}:${utcDate.getSeconds()}Z`;
  const formattedBuildDate = `${utcDate.getFullYear()}/${(
    utcDate.getMonth() + 1
  )
    .toString()
    .padStart(
      2,
      "0"
    )}/${utcDate.getDate()} ${utcDate.getHours()}:${utcDate.getMinutes()}:${utcDate.getSeconds()} UTC`;

  config.ui.validations.accessibility = false;
  config.ui.validations.html = false;

  app.set("config", config);

  fs.emptyDir(path.resolve(buildFolder), () => {
    const promises = [];

    promises.push(
      new Promise((resolve) => {
        buildDistDirectory(buildFolder).then(resolve);
      })
    );

    promises.push(
      new Promise((resolve) => {
        buildUserFavicon(buildFolder, app.get("config").ui.theme.favicon).then(
          resolve
        );
      })
    );

    promises.push(
      new Promise((resolve) => {
        buildUserAssets(
          buildFolder,
          app.get("config").assets,
          app.get("config").ui.theme.logo
        ).then(resolve);
      })
    );

    promises.push(
      new Promise((resolve) => {
        buildIframeIndex(buildFolder, app).then(resolve);
      })
    );

    promises.push(
      new Promise((resolve) => {
        buildIndex(buildFolder, app, buildDate, formattedBuildDate).then(
          resolve
        );
      })
    );

    const partials = Object.keys(app.get("state").partials);
    const readMes = Object.keys(app.get("state").fileContents)
      .filter((file) => file.endsWith("/README.md"))
      .map((file) =>
        file
          .replace(
            path.join(process.cwd(), app.get("config").components.folder, "/"),
            ""
          )
          .replace("/README.md", "")
      )
      .filter((file) => file !== "README.md");
    const files = partials.map((partial) => {
      return {
        file: partial,
        dir: path.dirname(partial),
      };
    });

    readMes.forEach((readMe) => {
      if (!files.find((file) => file.dir === readMe)) {
        files.push({
          file: null,
          dir: readMe,
        });
      }
    });

    const paths = [];
    for (const { file, dir } of files) {
      promises.push(
        new Promise((resolve) => {
          buildComponent({
            file,
            dir,
            buildFolder,
            app,
            buildDate,
            formattedBuildDate,
          }).then((component) => {
            for (const path of getFilePathsForJsonOutput(component)) {
              paths.push(path);
            }
            resolve();
          });
        })
      );
    }

    Promise.all(promises).then(() => {
      if (app.get("config").build.outputFile) {
        createJsonOutputFile(paths);
      }
      log("success", appConfig.messages.buildDone);
    });
  });

  /**
   * Creates an "output.json" file with the given array as content
   *
   * @param {Array} paths - all paths to standalone views of component variations
   */
  function createJsonOutputFile(paths) {
    fs.writeFile(
      path.join(buildFolder, "output.json"),
      JSON.stringify(
        paths.map((path) => {
          return {
            path,
          };
        }),
        null,
        2
      )
    );
  }

  /**
   * Accepts an array with arrays and returns its values with cwd and buildFolder
   *
   * @param {Array} component - an array containing arrays with file paths
   * @returns {Array} the flattened arrays
   */
  function getFilePathsForJsonOutput(component) {
    const paths = [];

    for (const entries of component) {
      if (entries) {
        for (const file of entries) {
          if (file) {
            paths.push(
              file.replace(path.join(process.cwd(), buildFolder, "/"), "")
            );
          }
        }
      }
    }

    return paths;
  }

  /**
   * Copies the user favicon
   *
   * @param {string} buildFolder - the build folder from the user configuration
   * @param {string} faviconPath - the favicon path from the user configuration
   * @returns {Promise} gets resolved after the favicon has been copied
   */
  function buildUserFavicon(buildFolder, faviconPath) {
    return new Promise((resolve) => {
      if (faviconPath) {
        fs.copy(
          path.join(process.cwd(), faviconPath),
          `${buildFolder}/favicon.ico`,
          resolve
        );
      } else {
        resolve();
      }
    });
  }

  /**
   * Copies the dist directory
   *
   * @param {string} buildFolder - the build folder from the user configuration
   * @returns {Promise} gets resolved when the dist directory has been copied
   */
  function buildDistDirectory(buildFolder) {
    return new Promise((resolve) =>
      fs.copy(
        path.join(__dirname, "../../dist/"),
        `${buildFolder}/miyagi/`,
        resolve
      )
    );
  }

  /**
   * Copies the user assets
   *
   * @param {string} buildFolder - the build folder from the user configuration
   * @param {object} assetsConfig - the assets object from the user configuration
   * @param {string} logoPath - the logo path from the user configuration
   * @returns {Promise} gets resolved when all assets have been copied
   */
  async function buildUserAssets(buildFolder, assetsConfig, logoPath) {
    const promises = [];

    if (logoPath) {
      promises.push(
        new Promise((resolve) =>
          fs.copy(
            path.resolve(logoPath),
            `${buildFolder}/${logoPath}`,
            async () => {
              for (const folder of assetsConfig.folder) {
                promises.push(
                  new Promise((resolve) => {
                    fs.copy(
                      path.resolve(folder),
                      path.join(
                        process.cwd(),
                        buildFolder,
                        path.basename(folder)
                      ),
                      resolve
                    );
                  })
                );
              }
              resolve();
            }
          )
        )
      );
    } else {
      for (const folder of assetsConfig.folder) {
        promises.push(
          new Promise((resolve) => {
            fs.copy(
              path.resolve(folder),
              path.join(process.cwd(), buildFolder, path.basename(folder)),
              resolve
            );
          })
        );
      }
    }

    const cssJsFiles = [
      ...assetsConfig.css,
      ...assetsConfig.js,
      ...assetsConfig.customProperties.files,
    ];

    for (const file of cssJsFiles) {
      promises.push(
        new Promise((resolve) =>
          fs.copy(
            path.resolve(file),
            `${buildFolder}/${path.basename(file)}`,
            resolve
          )
        )
      );
    }

    return Promise.all(promises);
  }

  /**
   * Rendeers and builds the component overview
   *
   * @param {string} buildFolder - the build folder from the user configuration
   * @param {object} app - the express instance
   * @returns {Promise} gets resolved when the view has been rendered
   */
  function buildIframeIndex(buildFolder, app) {
    const promises = [];

    for (const embedded of [false, true]) {
      promises.push(
        new Promise((resolve) => {
          render.renderIframeIndex({
            app,
            res: app,
            cb: (response) => {
              fs.writeFile(
                path.resolve(
                  `${buildFolder}/component-all${
                    embedded ? "-embedded" : ""
                  }.html`
                ),
                response,
                resolve
              );
            },
          });
        })
      );
    }

    return Promise.all(promises);
  }

  /**
   * Renders and builds the index view
   *
   * @param {string} buildFolder - the build folder from the user configuration
   * @param {object} app - the express instance
   * @param {string} buildDate - a machine readable date time string of the current build
   * @param {string} formattedBuildDate - a human readable date time string of the current build
   * @returns {Promise} gets resolved when the view has been rendered
   */
  function buildIndex(buildFolder, app, buildDate, formattedBuildDate) {
    return new Promise((resolve) => {
      render.renderMainIndex({
        app,
        res: app,
        buildDate,
        formattedBuildDate,
        cb: (response) => {
          fs.writeFile(
            path.resolve(`${buildFolder}/index.html`),
            response,
            resolve
          );
        },
      });
    });
  }

  /**
   * Renders and builds a variation
   *
   * @param {object} object - parameter object
   * @param {string} object.buildFolder - the build folder from the user configuration
   * @param {object} object.app - the express instance
   * @param {string} object.file - the template file path
   * @param {string} object.normalizedFileName - the normalized template file path
   * @param {string} object.variation - the variation name
   * @param {string} object.buildDate - a date time string of the current build
   * @param {string} object.formattedBuildDate - a formatted date time string of the current build
   * @returns {Promise} gets resolved when all variation views have been rendered
   */
  function buildVariation({
    buildFolder,
    app,
    file,
    normalizedFileName,
    variation,
    buildDate,
    formattedBuildDate,
  }) {
    const promises = [];

    for (const embedded of [false, true]) {
      promises.push(
        new Promise((resolve) => {
          const fileName = path.resolve(
            `${buildFolder}/component-${normalizedFileName}-variation-${helpers.normalizeString(
              variation
            )}${embedded ? "-embedded" : ""}.html`
          );

          render.renderIframeVariation({
            app,
            res: app,
            file: path.dirname(file),
            variation,
            embedded,
            cb: (response) => {
              fs.writeFile(fileName, response, () => {
                if (embedded) {
                  resolve(null);
                } else {
                  resolve(fileName);
                }
              });
            },
          });
        })
      );
    }

    promises.push(
      new Promise((resolve) => {
        render.renderMainComponent({
          app,
          res: app,
          file: path.dirname(file),
          variation,
          buildDate,
          formattedBuildDate,
          cb: (response) => {
            fs.writeFile(
              path.resolve(
                `${buildFolder}/show-${normalizedFileName}-variation-${helpers.normalizeString(
                  variation
                )}.html`
              ),
              response,
              resolve
            );
          },
        });
      })
    );

    return Promise.all(promises);
  }

  /**
   * Renders and builds a variation
   *
   * @param {object} object - parameter object
   * @param {string} object.file - the template file path
   * @param {string} object.dir - the directory of the component
   * @param {string} object.buildFolder - the build folder from the user configuration
   * @param {object} object.app - the express instance
   * @param {string} object.buildDate - a date time string of the current build
   * @param {string} object.formattedBuildDate - a formatted date time string of the current build
   * @returns {Promise} gets resolved when all component views have been rendered
   */
  function buildComponent({
    file,
    dir,
    buildFolder,
    app,
    buildDate,
    formattedBuildDate,
  }) {
    const promises = [];
    const normalizedFileName = helpers.normalizeString(dir);

    const data = app.get("state").fileContents[
      helpers.getDataPathFromTemplatePath(
        app,
        helpers.getFullPathFromShortPath(app, file)
      )
    ];

    promises.push(
      new Promise((resolve) => {
        render.renderMainComponent({
          app,
          res: app,
          file: dir,
          variation: null,
          buildDate,
          formattedBuildDate,
          cb: (response) => {
            fs.writeFile(
              path.resolve(`${buildFolder}/show-${normalizedFileName}.html`),
              response,
              resolve
            );
          },
        });
      })
    );

    for (const embedded of [false, true]) {
      promises.push(
        new Promise((resolve) => {
          render.renderIframeComponent({
            app,
            res: app,
            file: dir,
            cb: (response) => {
              fs.writeFile(
                path.resolve(
                  `${buildFolder}/component-${normalizedFileName}${
                    -embedded ? "-embedded" : ""
                  }.html`
                ),
                response,
                resolve
              );
            },
          });
        })
      );
    }

    if (file) {
      let variations = [];

      if (data) {
        const dataWithoutInternalKeys = helpers.removeInternalKeys(data);

        if (!data.$hidden && Object.keys(dataWithoutInternalKeys).length > 0) {
          variations.push({
            $name: data.$name || appConfig.defaultVariationName,
            ...dataWithoutInternalKeys,
          });
        }

        if (data.$variants) {
          variations = [...variations, ...data.$variants];
        }
      } else {
        variations.push({
          $name: appConfig.defaultVariationName,
        });
      }

      for (const variation of variations) {
        const name = variation.$name;

        if (!name) break;

        promises.push(
          new Promise((resolve) =>
            buildVariation({
              buildFolder,
              app,
              file,
              normalizedFileName,
              variation: name,
              buildDate,
              formattedBuildDate,
            }).then((fileName) => {
              resolve(fileName);
            })
          )
        );
      }
    }

    return Promise.all(promises);
  }
};
