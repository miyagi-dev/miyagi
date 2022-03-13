/**
 * Module for rendering a directory in the menu
 *
 * @module renderMenuDirectory
 */

const toggle = require("./toggle.js");
const menuHelpers = require("./helpers.js");
const classes = require("./classes.js");
const helpers = require("../../helpers.js");
const menu = require("./index.js");

/**
 * Renders a directory in the menu
 *
 * @param {object} app - the express instance
 * @param {object} directory - the directory which should be rendered
 * @param {object} request - the request object
 * @returns {string} the directory html
 */
function render(app, directory, request) {
  let html = "";

  if (menuHelpers.shouldRenderWithToggle(app, directory)) {
    const expanded = menuHelpers.pathIsParentOfOrEqualRequestedPath(
      helpers.getShortPathFromFullPath(directory.fullPath),
      request.path
    );

    html += toggle.render(
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
      ${menu.render(
        app,
        directory.children,
        request,
        directory.children.find((child) => typeof child.index !== "undefined")
          .index
      )}</div>`;
  }

  return html;
}

module.exports = {
  render,
};
