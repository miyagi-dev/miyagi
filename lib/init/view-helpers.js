"use strict";

const handlebars = require("handlebars");
const menu = require("../render/menu");

function getMenuHtml(children, path, variation, id) {
  return menu.render(this, children, { path, variation }, id, 0);
}

function getCssFilesHtml(files) {
  let html = "";

  files.forEach((file) => {
    html += `<link rel="stylesheet" href="${file}">`;
  });

  return html;
}

function getJsFilesHtml(files, es6Modules) {
  let html = "";

  files.forEach((file) => {
    html += `<script src="${file}" ${
      es6Modules ? 'type="module"' : "defer"
    }></script>`;
  });

  return html;
}

module.exports = function (app) {
  const { cssFiles, jsFiles, es6Modules } = app.get("config");

  handlebars.registerHelper("menu", getMenuHtml.bind(app));
  handlebars.registerHelper("cssFiles", getCssFilesHtml(cssFiles));
  handlebars.registerHelper("jsFiles", getJsFilesHtml(jsFiles, es6Modules));
};
