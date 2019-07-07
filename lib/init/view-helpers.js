"use strict";

const menu = require("../render/menu/index.js");

function partialPath(partial) {
  return partial;
}

function renderMenu(app, children, path, variation, id) {
  return menu.render(app, children, { path, variation }, id, 0);
}

function getCssFilesHtml(files) {
  let html = "";

  files.forEach(file => {
    html += `<link rel="stylesheet" href="${file}">`;
  });

  return html;
}

function getJsFilesHtml(files) {
  let html = "";

  files.forEach(file => {
    html += `<script src="${file}" defer></script>`;
  });

  return html;
}

module.exports = function(app, hbs) {
  hbs.registerHelper("partialPath", partialPath);

  hbs.registerHelper("renderMenu", (structure, path, variation, id) => {
    return renderMenu(app, structure, path, variation, id);
  });

  hbs.registerHelper("cssFiles", () => {
    const cssFiles =
      app.get("config").cssFiles instanceof Array
        ? app.get("config").cssFiles
        : app.get("config").cssFiles[process.env.NODE_ENV];

    if (cssFiles) {
      return getCssFilesHtml(
        app.get("config").cssFiles instanceof Array
          ? app.get("config").cssFiles
          : app.get("config").cssFiles[process.env.NODE_ENV]
      );
    } else {
      return "";
    }
  });

  hbs.registerHelper("jsFiles", () => {
    const jsFiles =
      app.get("config").jsFiles instanceof Array
        ? app.get("config").jsFiles
        : app.get("config").jsFiles[process.env.NODE_ENV];

    if (jsFiles) {
      return getJsFilesHtml(
        app.get("config").jsFiles instanceof Array
          ? app.get("config").jsFiles
          : app.get("config").jsFiles[process.env.NODE_ENV]
      );
    } else {
      return "";
    }
  });
};
