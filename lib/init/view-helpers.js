/**
 * Module for registering handlebars view helpers
 * @module init/view-helpers
 */

const handlebars = require("handlebars");
const menu = require("../render/menu");

function getMenuHtml(children, path, variation, id) {
  return menu.render(this, children, { path, variation }, id, 0);
}

function getCssFilesHtml(files) {
  let html = "";

  for (const file of files) {
    html += `<link rel="stylesheet" href="${file}">`;
  }

  return html;
}

function getJsFilesHtml(files, es6Modules) {
  let html = "";

  for (const file of files) {
    html += `<script src="${file}" ${
      es6Modules ? 'type="module"' : "defer"
    }></script>`;
  }

  return html;
}

module.exports = function initViewHelpers(app) {
  const { assets } = app.get("config");

  handlebars.registerHelper("menu", getMenuHtml.bind(app));
  handlebars.registerHelper("cssFiles", getCssFilesHtml(assets.css));
  handlebars.registerHelper(
    "jsFiles",
    getJsFilesHtml(assets.js, assets.es6Modules)
  );
};
