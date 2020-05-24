const fs = require("fs-extra");
const path = require("path");
const helpers = require("../helpers.js");
const render = require("../render/index.js");
const logger = require("../logger.js");
const appConfig = require("../config.json");

function buildUserFavicon(buildFolder, app) {
  return new Promise((resolve) => {
    if (app.get("config").ui && app.get("config").ui.theme) {
      fs.copy(
        path.join(process.cwd(), app.get("config").ui.theme.favicon),
        `${buildFolder}/favicon.ico`,
        resolve
      );
    } else {
      resolve();
    }
  });
}

function buildDistDirectory(buildFolder) {
  return new Promise((resolve) =>
    fs.copy(
      path.join(__dirname, "../../dist/"),
      `${buildFolder}/headman/`,
      resolve
    )
  );
}

function buildUserAssets(buildFolder, app) {
  const { assets, ui } = app.get("config");
  const promises = [];

  if (ui.theme && ui.theme.logo) {
    promises.push(
      new Promise((resolve) =>
        fs.copy(
          path.resolve(ui.theme.logo),
          `${buildFolder}/${ui.theme.logo}`,
          () => {
            if (assets && assets.folder) {
              for (const folder of assets.folder) {
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
            resolve();
          }
        )
      )
    );
  } else {
    if (assets && assets.folder) {
      for (const folder of assets.folder) {
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
  }

  const cssJsFiles = [...assets.css, ...assets.js];

  for (const file of cssJsFiles) {
    promises.push(
      new Promise((resolve) =>
        fs.copy(path.resolve(file), `${buildFolder}/${file}`, resolve)
      )
    );
  }

  return Promise.all(promises);
}

function buildComponentOverview(buildFolder, app) {
  const promises = [];

  for (const embedded of [false, true]) {
    promises.push(
      new Promise(async (resolve) => {
        await render.renderComponentOverview({
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

function buildIndex(buildFolder, app) {
  return new Promise(async (resolve) => {
    await render.renderMain({
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
      new Promise(async (resolve) => {
        await render.renderComponent({
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
    new Promise(async (resolve) => {
      await render.renderMainWithComponent({
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
  const rootVariation = path.basename(file, `.${extension}`);

  promises.push(
    new Promise(async (resolve) => {
      await render.renderMainWithComponent({
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
      new Promise(async (resolve) => {
        await render.renderComponentVariations({
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
    { name: "default" },
    ...(data && data.variations ? data.variations : []),
  ];

  for (const variation of variations) {
    const { name } = variation;

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

module.exports = (app) => {
  const { build, files } = app.get("config");
  const buildFolder = build.folder;
  const { extension } = files.templates;

  app.set("config").ui.validations.accessibility = false;
  app.set("config").ui.validations.html = false;

  fs.emptyDir(path.resolve(buildFolder), () => {
    const promises = [];

    promises.push(
      new Promise((resolve) => {
        buildDistDirectory(buildFolder).then(resolve);
      })
    );

    promises.push(
      new Promise((resolve) => {
        buildUserFavicon(buildFolder, app).then(resolve);
      })
    );

    promises.push(
      new Promise((resolve) => {
        buildUserAssets(buildFolder, app).then(resolve);
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
      logger.log("info", appConfig.messages.buildDone)
    );
  });
};
