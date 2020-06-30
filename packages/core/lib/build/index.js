const fs = require("fs-extra");
const path = require("path");
const helpers = require("../helpers.js");
const stateHelpers = require("../state/helpers.js");
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
        buildComponentOverview(buildFolder, app).then(resolve);
      })
    );

    promises.push(
      new Promise((resolve) => {
        buildIndex(buildFolder, app).then(resolve);
      })
    );

    const partials = Object.keys(app.get("state").partials);
    const paths = [];
    for (const file of partials) {
      promises.push(
        new Promise((resolve) => {
          buildComponent({ file, buildFolder, app }).then((component) => {
            for (const path of getFilePathForJsonOutput(component)) {
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
   * @param {Array} paths
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
        0,
        2
      )
    );
  }

  /**
   * Accepts an array with arrays and returns its values with cwd and buildFolder
   *
   * @param {Array} component - An array with file paths
   * @returns {Array}
   */
  function getFilePathForJsonOutput(component) {
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
   * @param {string} buildFolder
   * @param {string} faviconPath
   * @returns {Promise}
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
   * @param {string} buildFolder
   * @returns {Promise}
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
   * @param {string} buildFolder
   * @param {object} assetsConfig
   * @param {string} logoPath
   * @returns {Promise}
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
                const assetFiles = await stateHelpers.getFiles(
                  folder,
                  [],
                  function isAssetsFile(file) {
                    const extname = path.extname(file);
                    const extensions = new Set([
                      ".css",
                      ".js",
                      ".jpg",
                      ".png",
                      ".gif",
                      ".svg",
                      ".ico",
                    ]);
                    return extensions.has(extname) ? file : null;
                  }
                );
                for (const file of assetFiles) {
                  promises.push(
                    new Promise((resolve) => {
                      fs.copy(
                        file,
                        path.join(
                          process.cwd(),
                          buildFolder,
                          file.replace(process.cwd(), "")
                        ),
                        resolve
                      );
                    })
                  );
                }
              }
              resolve();
            }
          )
        )
      );
    } else {
      for (const folder of assetsConfig.folder) {
        const assetFiles = await stateHelpers.getFiles(
          folder,
          [],
          function isAssetsFile(file) {
            const extname = path.extname(file);
            const extensions = new Set([
              ".css",
              ".js",
              ".jpg",
              ".png",
              ".gif",
              ".svg",
              ".ico",
            ]);
            return extensions.has(extname) ? file : null;
          }
        );
        for (const file of assetFiles) {
          promises.push(
            new Promise((resolve) => {
              fs.copy(
                file,
                path.join(
                  process.cwd(),
                  buildFolder,
                  file.replace(process.cwd(), "")
                ),
                resolve
              );
            })
          );
        }
      }
    }

    const cssJsFiles = [...assetsConfig.css, ...assetsConfig.js];

    for (const file of cssJsFiles) {
      promises.push(
        new Promise((resolve) =>
          fs.copy(path.resolve(file), `${buildFolder}/${file}`, resolve)
        )
      );
    }

    return Promise.all(promises);
  }

  /**
   * Rendeers and builds the component overview
   *
   * @param {string} buildFolder
   * @param {object} app - the express instance
   * @returns {Promise}
   */
  function buildComponentOverview(buildFolder, app) {
    const promises = [];

    for (const embedded of [false, true]) {
      promises.push(
        new Promise((resolve) => {
          render.renderComponentOverview({
            app,
            res: app,
            embedded,
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
   * @param {string} buildFolder
   * @param {object} app - the express instance
   * @returns {Promise}
   */
  function buildIndex(buildFolder, app) {
    return new Promise((resolve) => {
      render.renderMain({
        app,
        res: app,
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
   * @param {object} obj
   * @param {string} obj.buildFolder
   * @param {object} obj.app
   * @param {string} obj.file - the template file path
   * @param {string} obj.normalizedFileName - the normalized template file path
   * @param {string} obj.variation - the variation name
   * @returns {Promise}
   */
  function buildVariation({
    buildFolder,
    app,
    file,
    normalizedFileName,
    variation,
  }) {
    const promises = [];

    for (const embedded of [false, true]) {
      promises.push(
        new Promise((resolve) => {
          const fileName = path.resolve(
            `${buildFolder}/component-${normalizedFileName}-${helpers.normalizeString(
              variation
            )}${embedded ? "-embedded" : ""}.html`
          );

          render.renderComponent({
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
        render.renderMainWithComponent({
          app,
          res: app,
          file: path.dirname(file),
          variation,
          cb: (response) => {
            fs.writeFile(
              path.resolve(
                `${buildFolder}/show-${normalizedFileName}-${helpers.normalizeString(
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
   * @param {object} obj
   * @param {string} obj.file - the template file path
   * @param {string} obj.buildFolder
   * @param {object} obj.app
   * @returns {Promise}
   */
  function buildComponent({ file, buildFolder, app }) {
    const promises = [];
    const normalizedFileName = helpers.normalizeString(path.dirname(file));

    const data = app.get("state").fileContents[
      helpers.getDataPathFromTemplatePath(
        app,
        helpers.getFullPathFromShortPath(app, file)
      )
    ];

    promises.push(
      new Promise((resolve) => {
        render.renderMainWithComponent({
          app,
          res: app,
          file: path.dirname(file),
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
          render.renderComponentVariations({
            app,
            res: app,
            file: path.dirname(file),
            embedded,
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

    const variations = [
      { $name: "default" },
      ...(data && data.$variants ? data.$variants : []),
    ];

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
          }).then((fileName) => {
            resolve(fileName);
          })
        )
      );
    }

    return Promise.all(promises);
  }
};
