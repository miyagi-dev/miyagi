/**
 * Module for rendering the menu
 *
 * @module renderMenu
 */

import { render as renderList } from "./list.js";
import { render as renderMenuItem } from "./menu-item.js";

/**
 * @param {object} app - the express instance
 * @param {Array} children - all items in the menu
 * @param {object} request - the request object
 * @param {number} index - the depth level in the navigation
 * @returns {string} the html of the menu
 */
export const render = function (app, children, request, index) {
  if (children.length) {
    return renderList(
      "components",
      index,
      (() => {
        let html = "";

        for (const child of children) {
          html += renderMenuItem(child, request, app);
        }

        return html;
      })()
    );
  }

  return "";
};
