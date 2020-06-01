/**
 * Module for rendering an item in the menu
 * @module render/menu/menu-item
 */

const component = require("./component.js");
const directory = require("./directory.js");
const listItem = require("./list-item.js");
const helpers = require("./helpers.js");

function render(dir, request, app) {
  return listItem.render(
    dir,
    (() => {
      let html = "";

      if (helpers.directoryHasComponent(dir)) {
        html += component.render(app, dir, request);
      } else {
        html += directory.render(app, dir, request);
      }

      return html;
    })(),
    "directory"
  );
}

module.exports = {
  render,
};
