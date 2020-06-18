/**
 * Module for rendering the menu
 *
 * @module render/menu
 */

const list = require("./list.js");

/**
 * @param {object} app - the express instance
 * @param children
 * @param {object} request - the request object
 * @param index
 * @returns {string} the html of the menu
 */
function render(app, children, request, index) {
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
