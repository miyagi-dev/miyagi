"use strict";

const path = require("path");
const helpers = require("../helpers.js");
const render = require("../render");

function getDataForComponent(app, component) {
  return app.get("state").data[
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
    data.variations.find(variant => variant.name === variation)
  );
}

function checkIfRequestedVariationIsValid(app, component, variation) {
  const data = getDataForComponent(app, component);

  if (!data) return false;

  if (variation === path.basename(component, `.${app.get("config").extension}`))
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
      if (req.query.file === "all") {
        await render.renderMain(req, res);
      } else if (checkIfRequestedComponentIsValid(app, req.query.file)) {
        if (req.query.variation) {
          if (
            checkIfRequestedVariationIsValid(
              app,
              req.query.file,
              req.query.variation
            )
          ) {
            await render.renderMainWithComponent(
              req,
              res,
              req.query.file,
              req.query.variation
            );
          } else {
            await render.renderMainWith404(
              req,
              res,
              req.query.file,
              req.query.variation,
              "Variation"
            );
          }
        } else {
          await render.renderMainWithComponent(req, res, req.query.file);
        }
      } else {
        await render.renderMainWith404(
          req,
          res,
          req.query.file,
          req.query.variation,
          "Component"
        );
      }
    })
  );

  app.get(
    "/component",
    awaitHandlerFactory(async (req, res) => {
      if (req.query.file === "all") {
        await render.renderComponentOverview(req, res, req.query.embedded);
      } else if (checkIfRequestedComponentIsValid(app, req.query.file)) {
        if (req.query.variation) {
          if (
            checkIfRequestedVariationIsValid(
              app,
              req.query.file,
              req.query.variation
            )
          ) {
            await render.renderComponent(
              req,
              res,
              req.query.file,
              req.query.variation,
              req.query.embedded
            );
          } else {
            await render.renderComponentNotFound(
              req,
              res,
              req.query.embedded,
              "Variation"
            );
          }
        } else {
          await render.renderComponentVariations(
            req,
            res,
            req.query.file,
            req.query.embedded
          );
        }
      } else {
        await render.renderComponentNotFound(
          req,
          res,
          req.query.embedded,
          "Component"
        );
      }
    })
  );

  app.get(
    "/",
    awaitHandlerFactory(async (req, res) => {
      await render.renderMain(req, res);
    })
  );

  app.all("*", (req, res) => {
    res.redirect("/");
  });
};
