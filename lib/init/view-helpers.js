"use strict";

const handlebars = require("handlebars");
const menu = require("../render/menu/index.js");

function renderMenu(app, children, path, variation, id) {
  return menu.render(app, children, { path, variation }, id, 0);
}

function getCssFilesHtml(app) {
  let html = "";

  app.get("config").cssFiles.forEach(file => {
    html += `<link rel="stylesheet" href="${file}">`;
  });

  return html;
}

function getJsFilesHtml(app) {
  let html = "";

  app.get("config").jsFiles.forEach(file => {
    html += `<script src="${file}"${
      app.get("config").es6Modules ? ' type="module"' : ""
    } defer></script>`;
  });

  return html;
}

module.exports = function(app) {
  handlebars.registerHelper("renderMenu", (structure, path, variation, id) => {
    return renderMenu(app, structure, path, variation, id);
  });

  handlebars.registerHelper("cssFiles", getCssFilesHtml(app));
  handlebars.registerHelper("jsFiles", getJsFilesHtml(app));
};
