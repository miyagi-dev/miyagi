/**
 * Module for accepting and routing requests
 *
 * @module initRouter
 */

const path = require("path");
const helpers = require("../helpers.js");
const config = require("../config.json");
const render = require("../render");

/**
 * @param {object} app - the express instance
 * @param {string} component - the component directory
 * @returns {object} the mock data of the given component
 */
function getDataForComponent(app, component) {
  return app.get("state").fileContents[
    helpers.getFullPathFromShortPath(
      app,
      path.join(
        component,
        `${app.get("config").files.mocks.name}.${
          app.get("config").files.mocks.extension
        }`
      )
    )
  ];
}

/**
 * @param {object} app - the express instance
 * @param {string} component - the component directory
 * @returns {boolean} is true if the requested component is stored in state.fileContents
 */
function checkIfRequestedComponentIsValid(app, component) {
  if (!component) return false;

  const { fileContents } = app.get("state");

  const files = Object.keys(fileContents).map((file) =>
    file.replace(
      path.join(process.cwd(), app.get("config").components.folder, "/"),
      ""
    )
  );
  const templateExtension = app.get("config").files.templates.extension;

  return files.includes(
    `${component}/${helpers.getResolvedFileName(
      app.get("config").files.templates.name,
      path.basename(component, `.${templateExtension}`)
    )}.${templateExtension}`
  );
}

/**
 * @param {object} app - the express instance
 * @param {string} component - the component directory
 * @returns {string}
 */
function checkIfRequestedFileIsDocFile(app, component) {
  if (!component) return false;

  const { fileContents } = app.get("state");
  const docsExtension = "md";

  if (component.endsWith(docsExtension)) {
    const var1 = path.join(
      process.cwd(),
      app.get("config").components.folder,
      component
    );

    if (var1 in fileContents) {
      return var1;
    }
  }

  const var1 = path.join(
    process.cwd(),
    app.get("config").components.folder,
    `${component}/${component}.${docsExtension}`
  );
  if (var1 in fileContents) {
    return var1;
  }

  const var2 = path.join(
    process.cwd(),
    app.get("config").components.folder,
    `${component}/README.${docsExtension}`
  );
  if (var2 in fileContents) {
    return var2;
  }

  const var3 = path.join(
    process.cwd(),
    app.get("config").components.folder,
    `${component}/index.${docsExtension}`
  );
  if (var3 in fileContents) {
    return var3;
  }

  const var4 = path.join(
    process.cwd(),
    app.get("config").components.folder,
    `${component}.md`
  );
  if (var4 in fileContents) {
    return var4;
  }

  return null;
}

/**
 * @param {object} data - mock data object
 * @param {string} variation - requested variation name
 * @returns {boolean} is true of the requested variation is in the given mock data
 */
function checkIfDataIncludesVariation(data, variation) {
  return (
    data.$variants &&
    data.$variants.length > 0 &&
    data.$variants.find((variant) => variant.$name === variation)
  );
}

/**
 * @param {object} app - the express instance
 * @param {string} component - the component directory
 * @param {string} variation - the requested variation name
 * @returns {boolean} is true if the requested variation exists in the mock data of the given component
 */
function checkIfRequestedVariationIsValid(app, component, variation) {
  const data = getDataForComponent(app, component);

  if (
    data &&
    (variation === data.$name || variation === config.defaultVariationName) &&
    !data.$hidden
  ) {
    return true;
  }

  if (!data && variation === config.defaultVariationName) {
    return true;
  }

  return checkIfDataIncludesVariation(data, variation);
}

/**
 * @param {Function} middleware - async callback function for requests
 * @returns {Function} wrapped async function
 */
function awaitHandlerFactory(middleware) {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = function Router(app) {
  app.get(
    "/show",
    awaitHandlerFactory(async (req, res) => {
      const { file, variation } = req.query;

      if (file) {
        const docFile = checkIfRequestedFileIsDocFile(app, file);

        if (file === "all") {
          await render.renderMainIndex({ app, res, cookies: req.cookies });
        } else if (checkIfRequestedComponentIsValid(app, file)) {
          if (variation) {
            if (checkIfRequestedVariationIsValid(app, file, variation)) {
              await render.renderMainComponent({
                app,
                res,
                file,
                variation,
                cookies: req.cookies,
              });
            } else {
              res.redirect(302, "/");
            }
          } else {
            await render.renderMainComponent({
              app,
              res,
              file,
              cookies: req.cookies,
            });
          }
        } else if (docFile) {
          await render.renderMainDocs({
            app,
            res,
            file: docFile.replace(
              path.join(process.cwd(), app.get("config").components.folder),
              ""
            ),
            cookies: req.cookies,
          });
        } else {
          res.redirect(302, "/");
        }
      } else {
        res.redirect(302, "/");
      }
    })
  );

  app.get(
    "/component",
    awaitHandlerFactory(async (req, res) => {
      const { file, variation, embedded } = req.query;

      if (file) {
        const docFile = checkIfRequestedFileIsDocFile(app, file);

        if (file === "all") {
          await render.renderIframeIndex({ app, res, cookies: req.cookies });
        } else if (checkIfRequestedComponentIsValid(app, file)) {
          if (variation) {
            if (checkIfRequestedVariationIsValid(app, file, variation)) {
              await render.renderIframeVariation({
                app,
                res,
                file,
                variation,
                embedded,
                cookies: req.cookies,
              });
            } else {
              res.redirect(302, "/component?file=all");
            }
          } else {
            await render.renderIframeComponent({
              app,
              res,
              file,
              cookies: req.cookies,
            });
          }
        } else if (docFile) {
          await render.renderIframeDocs({
            app,
            res,
            file,
            fullPath: docFile,
            cookies: req.cookies,
          });
        } else {
          res.redirect(302, "/component?file=all");
        }
      } else {
        res.redirect(302, "/component?file=all");
      }
    })
  );

  app.get(
    "/",
    awaitHandlerFactory(async (req, res) => {
      await render.renderMainIndex({ app, res, cookies: req.cookies });
    })
  );

  app.all("*", async (req, res) => {
    res.sendStatus(404);
  });
};
