/**
 * Module for rendering an item in the menu
 *
 * @module renderMenuMenuitem
 */

import { render as renderComponent } from "./component.js";
import { render as renderDirectory } from "./directory.js";
import { render as renderListItem } from "./list-item.js";
import helpers from "./helpers.js";

/**
 * Renders a menu item for a directory in the menu
 *
 * @param {object} dir - the directory which should be rendered
 * @param {object} request - the request object
 * @param {object} app - the express instance
 * @returns {string} the html of the menu item
 */
export const render = function (dir, request, app) {
  return renderListItem(
    dir.index,
    (() => {
      let html = "";

      if (helpers.directoryHasComponent(dir)) {
        html += renderComponent(app, dir, request);
      } else {
        html += renderDirectory(app, dir, request);
      }

      return html;
    })(),
    "directory"
  );
};
