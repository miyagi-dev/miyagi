/**
 * Module for registering handlebars view helpers
 *
 * @module initViewhelpers
 */

const handlebars = require("handlebars");
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
 * @param {string[]} files - the paths to CSS files
 * @returns {string} the html with link tags
 */
function getCssFilesHtml(files) {
  let html = "";

  for (let file of files) {
    html += `<link rel="stylesheet" href="${file}">\n`;
  }

  return html;
}

/**
 * Renders all script tags for given javascript files
 *
 * @param {string[]} files - the paths to JS files
 * @param {boolean} es6Modules - describes if the scripts should be rendered with type="module"
 * @returns {string} the html with script tags
 */
function getJsFilesHtml(files, es6Modules) {
  let html = "";

  for (let file of files) {
    html += `<script src="${file}" ${
      es6Modules ? 'type="module"' : "defer"
    }></script>`;
  }

  return html;
}

module.exports = function initViewHelpers(app) {
  const { assets } = app.get("config");

  handlebars.registerHelper("menu", getMenuHtml.bind(app));
  handlebars.registerHelper("cssFiles", getCssFilesHtml.call(null, assets.css));
  handlebars.registerHelper(
    "jsFiles",
    getJsFilesHtml.call(null, assets.js, assets.es6Modules)
  );
  handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
};
