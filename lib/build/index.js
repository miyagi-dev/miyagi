const fs = require("fs-extra");
const path = require("path");
const helpers = require("../helpers.js");
const render = require("../render/index.js");
const log = require("../logger.js");
const appConfig = require("../config.json");

/**
 * Module for creating a static build
 * @module build
 * @param {require('express').default} obj.app
 */
module.exports = (app) => {
  const config = { ...app.get("config") };
  const { build, files } = config;
  const buildFolder = build.folder;
  const { extension } = files.templates;

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
    for (const file of partials) {
      promises.push(
        new Promise((resolve) => {
          buildComponent({ file, buildFolder, app, extension }).then(resolve);
        })
      );
    }

    Promise.all(promises).then(() =>
      log("success", appConfig.messages.buildDone)
    );
  });

  /**
   * Copies the user favicon
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
   * @param {string} buildFolder
   * @returns {Promise}
   */
  function buildDistDirectory(buildFolder) {
    return new Promise((resolve) =>
      fs.copy(
        path.join(__dirname, "../../dist/"),
        `${buildFolder}/headman/`,
        resolve
      )
    );
  }

  /**
   * Copies the user assets
   * @param {string} buildFolder
   * @param {Object} assetsConfig
   * @param {string} logoPath
   * @returns {Promise}
   */
  function buildUserAssets(buildFolder, assetsConfig, logoPath) {
    const promises = [];

    if (logoPath) {
      promises.push(
        new Promise((resolve) =>
          fs.copy(path.resolve(logoPath), `${buildFolder}/${logoPath}`, () => {
            for (const folder of assetsConfig.folder) {
              promises.push(
                new Promise((res) => {
                  fs.copy(
                    path.resolve(folder),
                    path.resolve(buildFolder, folder),
                    res
                  );
                })
              );
            }
            resolve();
          })
        )
      );
    } else {
      for (const folder of assetsConfig.folder) {
        promises.push(
          new Promise((resolve) => {
            fs.copy(
              path.resolve(folder),
              path.resolve(buildFolder, folder),
              resolve
            );
          })
        );
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
   * @param {string} buildFolder
   * @param {require('express').default} app
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
   * @param {string} buildFolder
   * @param {require('express').default} app
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
   * @param {Object} obj
   * @param {string} obj.buildFolder
   * @param {require('express').default} obj.app
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
          render.renderComponent({
            app,
            res: app,
            file,
            variation,
            embedded,
            cb: (response) => {
              fs.writeFile(
                path.resolve(
                  `${buildFolder}/component-${normalizedFileName}-${helpers.normalizeString(
                    variation
                  )}${embedded ? "-embedded" : ""}.html`
                ),
                response,
                resolve
              );
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
          file,
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
   * @param {Object} obj
   * @param {string} obj.file - the template file path
   * @param {string} obj.buildFolder
   * @param {require('express').default} obj.app
   * @param {string} obj.extension - the extension of the template file
   * @returns {Promise}
   */
  function buildComponent({ file, buildFolder, app, extension }) {
    const promises = [];
    const normalizedFileName = helpers.normalizeString(
      file.replace(`.${extension}`, "")
    );
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
          file,
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
            file,
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
      ...(data && data.$variations ? data.$variations : []),
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
          }).then(resolve)
        )
      );
    }

    return Promise.all(promises);
  }
};
