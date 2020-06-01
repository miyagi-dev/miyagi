/**
 * Module for rendering the menu
 * @module render/menu
 */

const list = require("./list.js");

function render(app, children, request, id, index) {
  if (children.length) {
    return list.render(
      "components",
      index,
      (() => {
        let html = "";

        for (const child of children) {
          html += require("./menu-item.js").render(child, request, app);
        }

        return html;
      })()
    );
  }

  return "";
}

module.exports = {
  render,
};
