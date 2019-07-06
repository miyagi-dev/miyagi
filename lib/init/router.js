"use strict";

const path = require("path");
const helpers = require("../helpers.js");
const render = require("../render/index.js");

function checkIfRequestedComponentIsValid(app, component) {
  return (
    app.get("state").partials.hasOwnProperty(component) &&
    app.get("state").partials[component] !== "undefined"
  );
}

function checkIfRequestedVariationIsValid(app, component, variation) {
  const data = app.get("state").data[
    helpers.getFullPathFromShortPath(
      app,
      helpers.getDataPathFromTemplatePath(app, component)
    )
  ];

  const basename = path.basename(component, `.${app.get("config").extension}`);

  if (!data) {
    return false;
  }

  return (
    data.hasOwnProperty("variations") &&
    data.variations.length > 0 &&
    (data.variations.filter(variant => variant.name === variation).length > 0 ||
      variation === basename)
  );
}

module.exports = function(app) {
  app.get("/show", (req, res) => {
    if (req.query.file === "all") {
      render.renderMain(req, res);
    } else if (checkIfRequestedComponentIsValid(app, req.query.file)) {
      if (req.query.variation) {
        if (
          checkIfRequestedVariationIsValid(
            app,
            req.query.file,
            req.query.variation
          )
        ) {
          render.renderMainWithComponent(
            req,
            res,
            req.query.file,
            req.query.variation
          );
        } else {
          render.renderMainWith404(
            req,
            res,
            req.query.file,
            req.query.variation,
            "Variation"
          );
        }
      } else {
        render.renderMainWithComponent(req, res, req.query.file);
      }
    } else {
      render.renderMainWith404(
        req,
        res,
        req.query.file,
        req.query.variation,
        "Component"
      );
    }
  });

  app.get("/component", (req, res) => {
    if (req.query.file === "all") {
      render.renderComponentOverview(req, res, req.query.embedded);
    } else if (checkIfRequestedComponentIsValid(app, req.query.file)) {
      if (req.query.variation) {
        if (
          checkIfRequestedVariationIsValid(
            app,
            req.query.file,
            req.query.variation
          )
        ) {
          render.renderComponent(
            req,
            res,
            req.query.file,
            req.query.variation,
            req.query.embedded
          );
        } else {
          render.renderComponentNotFound(
            req,
            res,
            req.query.embedded,
            "Variation"
          );
        }
      } else {
        render.renderComponentVariations(
          req,
          res,
          req.query.file,
          req.query.embedded
        );
      }
    } else {
      render.renderComponentNotFound(req, res, req.query.embedded, "Component");
    }
  });

  app.get("/", (req, res) => {
    render.renderMain(req, res);
  });

  app.all("*", (req, res) => {
    res.redirect("/");
  });
};
