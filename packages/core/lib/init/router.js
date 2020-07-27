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
 * @returns {boolean} is true if the requested component is stored in state.partials
 */
function checkIfRequestedComponentIsValid(app, component) {
  const { partials } = app.get("state");

  return Object.keys(partials)
    .map((partial) => path.dirname(partial))
    .includes(component);
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

      if (file === "all") {
        await render.renderMainIndex({ app, res });
      } else if (checkIfRequestedComponentIsValid(app, file)) {
        if (variation) {
          if (checkIfRequestedVariationIsValid(app, file, variation)) {
            await render.renderMainComponent({ app, res, file, variation });
          } else {
            await render.renderMain404({ app, res, file, variation });
          }
        } else {
          await render.renderMainComponent({ app, res, file });
        }
      } else {
        await render.renderMain404({ app, res, file, variation });
      }
    })
  );

  app.get(
    "/component",
    awaitHandlerFactory(async (req, res) => {
      const { file, variation, embedded } = req.query;

      if (file === "all") {
        await render.renderIframeIndex({ app, res });
      } else if (checkIfRequestedComponentIsValid(app, file)) {
        if (variation) {
          if (checkIfRequestedVariationIsValid(app, file, variation)) {
            await render.renderIframeVariation({
              app,
              res,
              file,
              variation,
              embedded,
            });
          } else {
            await render.renderIframe404({
              app,
              res,
              embedded,
              target: "Variation",
            });
          }
        } else {
          await render.renderIframeComponent({ app, res, file });
        }
      } else {
        await render.renderIframe404({
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
      await render.renderMainIndex({ app, res });
    })
  );

  app.all("*", async (req, res) => {
    if (req.headers.referer) {
      await render.renderIframe404({
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
