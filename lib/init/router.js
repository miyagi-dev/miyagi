"use strict";

const helpers = require("../helpers.js");
const config = require("../config.json");
const render = require("../render");

function getDataForComponent(app, component) {
  return app.get("state").fileContents[
    helpers.getFullPathFromShortPath(
      app,
      helpers.getDataPathFromTemplatePath(app, component)
    )
  ];
}

function checkIfRequestedComponentIsValid(app, component) {
  const { partials } = app.get("state");

  return (
    partials.hasOwnProperty(component) && partials[component] !== "undefined"
  );
}

function checkIfDataIncludesVariation(data, variation) {
  return (
    data.hasOwnProperty("variations") &&
    data.variations.length > 0 &&
    data.variations.find((variant) => variant.name === variation)
  );
}

function checkIfRequestedVariationIsValid(app, component, variation) {
  const data = getDataForComponent(app, component);

  if (variation === config.defaultVariationName && !data.data.$hidden)
    return true;

  return checkIfDataIncludesVariation(data, variation);
}

function awaitHandlerFactory(middleware) {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = function(app) {
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

  app.all("*", (req, res) => {
    res.redirect("/");
  });
};
