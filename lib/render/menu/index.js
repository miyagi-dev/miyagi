"use strict";

const list = require("./list.js");

function render(app, children, request, id, index) {
  if (children.length) {
    return list.render(
      "components",
      index,
      (() => {
        let html = "";

        children.forEach((child) => {
          html += require("./menu-item.js").render(child, request, app);
        });

        return html;
      })()
    );
  }

  return "";
}

module.exports = {
  render,
};
