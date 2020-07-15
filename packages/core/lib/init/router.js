/**
 * Module for accepting and routing requests
 *
 * @module init/router
 */

const path = require("path");
const helpers = require("../helpers.js");
const config = require("../config.json");
const render = require("../render");

/**
 * @param {object} app - the express instance
 * @param component
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
 * @param component
 */
function checkIfRequestedComponentIsValid(app, component) {
  const { partials } = app.get("state");

  return Object.keys(partials)
    .map((partial) => path.dirname(partial))
    .includes(component);
}

/**
 * @param data
 * @param variation
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
 * @param component
 * @param variation
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
 * @param middleware
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

      if (file === "all") {
        await render.renderMain({ app, res });
      } else if (checkIfRequestedComponentIsValid(app, file)) {
        if (variation) {
          if (checkIfRequestedVariationIsValid(app, file, variation)) {
            await render.renderMainWithComponent({ app, res, file, variation });
          } else {
            await render.renderMainWith404({ app, res, file, variation });
          }
        } else {
          await render.renderMainWithComponent({ app, res, file });
        }
      } else {
        await render.renderMainWith404({ app, res, file, variation });
      }
    })
  );

  app.get(
    "/component",
    awaitHandlerFactory(async (req, res) => {
      const { file, variation, embedded } = req.query;

      if (file === "all") {
        await render.renderComponentOverview({ app, res, embedded });
      } else if (checkIfRequestedComponentIsValid(app, file)) {
        if (variation) {
          if (checkIfRequestedVariationIsValid(app, file, variation)) {
            await render.renderComponent({
              app,
              res,
              file,
              variation,
              embedded,
            });
          } else {
            await render.renderComponentNotFound({
              app,
              res,
              embedded,
              target: "Variation",
            });
          }
        } else {
          await render.renderComponentVariations({ app, res, file, embedded });
        }
      } else {
        await render.renderComponentNotFound({
          app,
          res,
          embedded,
          target: "Component",
        });
      }
    })
  );

  app.get(
    "/",
    awaitHandlerFactory(async (req, res) => {
      await render.renderMain({ app, res });
    })
  );

  app.all("*", async (req, res) => {
    if (req.headers.referer) {
      await render.renderComponentNotFound({
        app,
        res,
        embedded: true,
        target: "Page",
      });
    } else {
      res.redirect("/");
    }
  });
};
