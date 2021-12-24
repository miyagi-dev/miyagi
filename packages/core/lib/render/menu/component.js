/**
 * Module for rendering a component in the menu
 *
 * @module renderMenuComponent
 */

import { render as renderToggle } from "./toggle.js";
import { render as renderVariations } from "./variations.js";
import { render as renderList } from "./list.js";
import classes from "./classes.js";
import menuHelpers from "./helpers.js";
import { render as renderMenu } from "./index.js";

/**
 * Renders a component in the menu
 *
 * @param {object} app - the express instance
 * @param {object} component - the component which should be rendered
 * @param {object} request - the request object
 * @returns {string} the component html
 */
export const render = function (app, component, request) {
  const hasVariations = menuHelpers.componentHasVariations(component);
  let html = "";
  const current = request.path === component.shortPath && !request.variation;

  if (
    hasVariations ||
    menuHelpers.childrenOfDirectoryContainDirectory(component)
  ) {
    const expanded = menuHelpers.pathIsParentOfOrEqualRequestedPath(
      component.shortPath,
      request.path
    );

    html += renderToggle(
      `${component.id}-variations`,
      expanded,
      component.index
    );
  }

  const href = app.get("config").isBuild
    ? `component-${component.normalizedShortPath}-embedded.html`
    : `/component?file=${component.shortPath}&embedded=true`;

  html += `<a class="${classes.component} ${classes.component}--lvl${
    component.index
  } ${classes.link} ${classes.link}--lvl${
    component.index
  }" target="iframe" href="${href}"${current ? menuHelpers.activeState : ""}>${
    component.name
  }</a>`;

  html += `<div class="${classes.listContainer}"${
    component.id ? ` id="${component.id}-variations"` : ""
  }>`;

  if (hasVariations) {
    html += renderList(
      "variations",
      component.index,
      renderVariations(app.get("config").isBuild, component, request)
    );
  }

  // starts recursion
  if (component.children && component.children.length) {
    html += renderMenu(
      app,
      component.children,
      request,
      component.children.find((child) => typeof child.index !== "undefined")
        .index
    );
  }

  html += "</div>";

  return html;
};
