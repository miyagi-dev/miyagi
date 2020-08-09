/**
 * Module for registering handlebars view helpers
 *
 * @module initViewhelpers
 */

const handlebars = require("handlebars");
const path = require("path");
const menu = require("../render/menu");

/**
 * Returns the menu html
 *
 * @param {object[]} children - all items in the menu
 * @param {string} path - the requested component
 * @param {string} variation - the requested variation
 * @returns {string} the menu html
 */
function getMenuHtml(children, path, variation) {
  return menu.render(this, children, { path, variation }, 0);
}

/**
 * Renders all link tags for given stylesheet files
 *
 * @param {boolean} isBuild - defines if a build is created or not
 * @param {string[]} files - the paths to CSS files
 * @returns {string} the html with link tags
 */
function getCssFilesHtml(isBuild, files) {
  let html = "";

  for (let file of files) {
    if (
      isBuild &&
      !file.startsWith("http://") &&
      !file.startsWith("https://") &&
      !file.startsWith("//")
    ) {
      file = path.basename(file);
    }

    html += `<link rel="stylesheet" href="${file}">`;
  }

  return html;
}

/**
 * Renders all script tags for given javascript files
 *
 * @param {boolean} isBuild - defines if a build is created or not
 * @param {string[]} files - the paths to JS files
 * @param {boolean} es6Modules - describes if the scripts should be rendered with type="module"
 * @returns {string} the html with script tags
 */
function getJsFilesHtml(isBuild, files, es6Modules) {
  let html = "";

  for (let file of files) {
    if (
      isBuild &&
      !file.startsWith("http://") &&
      !file.startsWith("https://") &&
      !file.startsWith("//")
    ) {
      file = path.basename(file);
    }

    html += `<script src="${file}" ${
      es6Modules ? 'type="module"' : "defer"
    }></script>`;
  }

  return html;
}

module.exports = function initViewHelpers(app) {
  const { assets, isBuild } = app.get("config");

  handlebars.registerHelper("menu", getMenuHtml.bind(app));
  handlebars.registerHelper(
    "cssFiles",
    getCssFilesHtml.call(null, isBuild, assets.css)
  );
  handlebars.registerHelper(
    "jsFiles",
    getJsFilesHtml.call(null, isBuild, assets.js, assets.es6Modules)
  );
};
