"use strict";

const component = require("./component.js");
const directory = require("./directory.js");
const listItem = require("./list-item.js");
const menu = require("./index.js");
const helpers = require("./_helpers.js");

function render(dir, request, app) {
  return listItem.render(
    dir,
    (() => {
      let html = "";

      if (helpers.directoryHasComponent(dir)) {
        html += component.render(dir, request);
      } else {
        html += directory.render(app, dir, request);
      }

      // starts recursion
      if (dir.children && dir.children.length) {
        html += menu.render(
          app,
          dir.children,
          request,
          dir.id,
          dir.children.find(child => typeof child.index !== "undefined").index
        );
      }

      return html;
    })(),
    "directory"
  );
}

module.exports = {
  render
};
