/**
 * Module for rendering a directory in the menu
 *
 * @module renderMenuDirectory
 */

import { render as renderToggle } from "./toggle.js";
import { render as renderMenu } from "./index.js";
import menuHelpers from "./helpers.js";
import classes from "./classes.js";
import { getShortPathFromFullPath } from "../../helpers.js";

/**
 * Renders a directory in the menu
 *
 * @param {object} app - the express instance
 * @param {object} directory - the directory which should be rendered
 * @param {object} request - the request object
 * @returns {string} the directory html
 */
export const render = function (app, directory, request) {
  let html = "";

  if (menuHelpers.childrenOfDirectoryContainDirectory(directory)) {
    const expanded = menuHelpers.pathIsParentOfOrEqualRequestedPath(
      getShortPathFromFullPath(app, directory.fullPath),
      request.path
    );

    html += renderToggle(
      `${directory.id}-components`,
      expanded,
      directory.index
    );
  }

  html += `<span class="${classes.component} ${classes.component}--lvl${directory.index}">${directory.name}</span>`;

  // starts recursion
  if (directory.children && directory.children.length) {
    html += `<div class="${classes.listContainer}"${
      directory.id ? ` id="${directory.id}-components"` : ""
    }>
      ${renderMenu(
        app,
        directory.children,
        request,
        directory.children.find((child) => typeof child.index !== "undefined")
          .index
      )}</div>`;
  }

  return html;
};
