"use strict";

const toggle = require("./toggle.js");
const variations = require("./variations.js");
const list = require("./list.js");
const helpers = require("../../helpers.js");
const classes = require("./_classes.js");
const menuHelpers = require("./_helpers.js");

function render(component, request) {
  const hasVariations = menuHelpers.componentHasVariations(component);
  let html = "";
  let current = request.path === component.shortPath && !request.variation;

  if (
    hasVariations ||
    menuHelpers.childrenOfDirectoryContainDirectory(component)
  ) {
    const expanded = menuHelpers.pathIsChildOfSecondPath(
      component.shortPath,
      request.path,
      true
    );

    html += toggle.render(
      `${component.id}-variations`,
      expanded,
      component.index
    );
  }

  const href = helpers.isBuild()
    ? `component-${component.normalizedShortPath}-embedded.html`
    : `/component?file=${component.shortPath}&embedded=true`;

  html += `<a class="${classes.component} ${classes.component}--lvl${
    component.index
  } ${classes.link} ${classes.link}--lvl${
    component.index
  }" target="iframe" href="${href}"${current ? menuHelpers.activeState : ""}>${
    component.name
  }</a>`;

  if (hasVariations) {
    html += list.render(
      "variations",
      component.index,
      component.id ? `${component.id}-variations` : null,
      variations.render(component, request)
    );
  }

  return html;
}

module.exports = {
  render
};
