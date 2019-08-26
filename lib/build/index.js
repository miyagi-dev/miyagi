const fs = require("fs-extra");
const path = require("path");
const helpers = require("../helpers.js");
const render = require("../render/index.js");
const logger = require("../logger.js");
const appConfig = require("../config.json");

function buildDistDirectory(buildFolder) {
  return new Promise(resolve =>
    fs.copy(
      path.join(__dirname, "../../dist/"),
      `${buildFolder}/headman/`,
      resolve
    )
  );
}

function buildUserAssets(buildFolder, app) {
  const { cssFiles, jsFiles } = app.get("config");
  const promises = [];

  [...cssFiles, ...jsFiles].forEach(file =>
    promises.push(
      new Promise(resolve =>
        fs.copy(path.resolve(file), `${buildFolder}/${file}`, resolve)
      )
    )
  );

  return Promise.all(promises);
}

function buildComponentOverview(buildFolder, app) {
  const promises = [];

  [false, true].forEach(embedded => {
    promises.push(
      new Promise(async resolve => {
        await render.renderComponentOverview({
          app,
          res: app,
          embedded,
          cb: response => {
            fs.writeFile(
              path.resolve(
                `${buildFolder}/component-all${
                  embedded ? "-embedded" : ""
                }.html`
              ),
              response,
              resolve
            );
          }
        });
      })
    );
  });

  return Promise.all(promises);
}

function buildIndex(buildFolder, app) {
  return new Promise(async resolve => {
    await render.renderMain({
      app,
      res: app,
      build: true,
      cb: response => {
        fs.writeFile(
          path.resolve(`${buildFolder}/index.html`),
          response,
          resolve
        );
      }
    });
  });
}

function buildVariation({
  buildFolder,
  app,
  file,
  normalizedFileName,
  variation
}) {
  const promises = [];

  [false, true].forEach(embedded => {
    promises.push(
      new Promise(async resolve => {
        await render.renderComponent({
          app,
          res: app,
          file,
          variation,
          embedded,
          cb: response => {
            fs.writeFile(
              path.resolve(
                `${buildFolder}/component-${normalizedFileName}-${helpers.normalizeString(
                  variation
                )}${embedded ? "-embedded" : ""}.html`
              ),
              response,
              resolve
            );
          }
        });
      })
    );
  });

  promises.push(
    new Promise(async resolve => {
      await render.renderMainWithComponent({
        app,
        res: app,
        file,
        variation,
        build: true,
        cb: response => {
          fs.writeFile(
            path.resolve(
              `${buildFolder}/show-${normalizedFileName}-${helpers.normalizeString(
                variation
              )}.html`
            ),
            response,
            resolve
          );
        }
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
  const data = app.get("state").data[
    helpers.getDataPathFromTemplatePath(
      app,
      helpers.getFullPathFromShortPath(app, file)
    )
  ];
  const rootVariation = path.basename(file, `.${extension}`);

  promises.push(
    new Promise(async resolve => {
      await render.renderMainWithComponent({
        app,
        res: app,
        file,
        build: true,
        cb: response => {
          fs.writeFile(
            path.resolve(`${buildFolder}/show-${normalizedFileName}.html`),
            response,
            resolve
          );
        }
      });
    })
  );

  [false, true].forEach(embedded => {
    promises.push(
      new Promise(async resolve => {
        await render.renderComponentVariations({
          app,
          res: app,
          file,
          embedded,
          cb: response => {
            fs.writeFile(
              path.resolve(
                `${buildFolder}/component-${normalizedFileName}${
                  -embedded ? "-embedded" : ""
                }.html`
              ),
              response,
              resolve
            );
          }
        });
      })
    );
  });

  [
    { name: rootVariation },
    ...(data && data.variations ? data.variations : [])
  ].forEach(async ({ name }) => {
    if (!name) return;

    promises.push(
      new Promise(resolve =>
        buildVariation({
          buildFolder,
          app,
          file,
          normalizedFileName,
          variation: name
        }).then(resolve)
      )
    );
  });

  return Promise.all(promises);
}

module.exports = app => {
  const { buildFolder, extension } = app.get("config");

  fs.emptyDir(path.resolve(buildFolder), () => {
    const promises = [];

    promises.push(
      new Promise(resolve => {
        buildDistDirectory(buildFolder).then(resolve);
      })
    );

    promises.push(
      new Promise(resolve => {
        buildUserAssets(buildFolder, app).then(resolve);
      })
    );

    promises.push(
      new Promise(resolve => {
        buildComponentOverview(buildFolder, app).then(resolve);
      })
    );

    promises.push(
      new Promise(resolve => {
        buildIndex(buildFolder, app).then(resolve);
      })
    );

    Object.keys(app.get("state").partials).forEach(file => {
      promises.push(
        new Promise(resolve => {
          buildComponent({ file, buildFolder, app, extension }).then(resolve);
        })
      );
    });

    Promise.all(promises).then(() =>
      logger.log("info", appConfig.messages.buildDone)
    );
  });
};
