/**
 * Module for rendering a directory in the menu
 * @module render/menu/directory
 */

const toggle = require("./toggle.js");
const menuHelpers = require("./helpers.js");
const classes = require("./classes.js");
const helpers = require("../../helpers.js");
const menu = require("./index.js");

function render(app, directory, request) {
  let html = "";

  if (
    menuHelpers.childrenOfDirectoryContainDirectory(directory) &&
    menuHelpers.directoryIsNotTopLevel(directory)
  ) {
    const expanded = menuHelpers.pathIsChildOfSecondPath(
      helpers.getShortPathFromFullPath(app, directory.fullPath),
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
      directory.id ? ` id="${directory.id}-variations"` : ""
    }>
      ${menu.render(
        app,
        directory.children,
        request,
        directory.id,
        directory.children.find((child) => typeof child.index !== "undefined")
          .index
      )}</div>`;
  }

  return html;
}

module.exports = {
  render,
};
