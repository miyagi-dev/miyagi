/**
 * Module for accepting and routing requests
 *
 * @module initRouter
 */

import path from "path";
import { getFullPathFromShortPath, getResolvedFileName } from "../helpers.js";
import config from "../miyagi-config.js";
import render from "../render/index.js";

/**
 * @param {object} app - the express instance
 * @param {string} component - the component directory
 * @returns {object} the mock data of the given component
 */
function getDataForComponent(app, component) {
  return app.get("state").fileContents[
    getFullPathFromShortPath(
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
  const { fileContents } = app.get("state");

  const files = Object.keys(fileContents).map((file) =>
    file.replace(
      path.join(process.cwd(), app.get("config").components.folder, "/"),
      ""
    )
  );

  return (
    files.includes(
      `${component}/${getResolvedFileName(
        app.get("config").files.templates.name,
        path.basename(
          component,
          `.${app.get("config").files.templates.extension}`
        )
      )}.${app.get("config").files.templates.extension}`
    ) ||
    files.includes(
      `${component}/${getResolvedFileName(
        app.get("config").files.docs.name,
        path.basename(component, `.${app.get("config").files.docs.extension}`)
      )}.${app.get("config").files.docs.extension}`
    )
  );
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

export default function Router(app) {
  app.get(
    "/show",
    awaitHandlerFactory(async (req, res) => {
      const { file, variation } = req.query;

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
            await render.renderMain404({
              app,
              res,
              file,
              variation,
              cookies: req.cookies,
            });
          }
        } else {
          await render.renderMainComponent({
            app,
            res,
            file,
            cookies: req.cookies,
          });
        }
      } else {
        await render.renderMain404({
          app,
          res,
          file,
          variation,
          cookies: req.cookies,
        });
      }
    })
  );

  app.get(
    "/component",
    awaitHandlerFactory(async (req, res) => {
      const { file, variation, embedded } = req.query;

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
            await render.renderIframe404({
              app,
              res,
              embedded,
              target: "Variation",
              cookies: req.cookies,
            });
          }
        } else {
          await render.renderIframeComponent({
            app,
            res,
            file,
            cookies: req.cookies,
          });
        }
      } else {
        await render.renderIframe404({
          app,
          res,
          embedded,
          target: "Component",
          cookies: req.cookies,
        });
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
    if (req.headers.referer) {
      await render.renderIframe404({
        app,
        res,
        embedded: true,
        target: "Page",
        cookies: req.cookies,
      });
    } else {
      res.redirect("/");
    }
  });
}
