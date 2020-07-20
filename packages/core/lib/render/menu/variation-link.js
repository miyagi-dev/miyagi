/**
 * Module for rendering a variation link in the menu
 *
 * @module render/menu/variation-link
 */

const classes = require("./classes.js");
const helpers = require("../../helpers.js");
const menuHelpers = require("./helpers.js");

/**
 * Renders a variation link of a given component
 *
 * @param {boolean} isBuild - renders a build or not
 * @param {object} component
 * @param {object} variation
 * @param {boolean} isCurrent
 * @returns {string} the html with the variation link
 */
function render(isBuild, component, variation, isCurrent) {
  const href = isBuild
    ? `component-${
        component.normalizedShortPath
      }-variation-${helpers.normalizeString(variation.name)}-embedded.html`
    : `/component?file=${component.shortPath}&variation=${encodeURI(
        variation.name
      )}&embedded=true`;

  return `<a class="${classes.link} ${classes.link}--lvl${component.index} ${
    classes.link
  }--variation" target="iframe" href="${href}"${
    isCurrent ? menuHelpers.activeState : ""
  }>${variation.name}</a>`;
}

module.exports = {
  render,
};
