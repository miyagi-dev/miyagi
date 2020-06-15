/**
 * Module for rendering a list of variations in the menu
 * @module render/menu/variations
 */

const listItem = require("./list-item.js");
const variationLink = require("./variation-link.js");
const helpers = require("./helpers.js");

function render(isBuild, component, request) {
  let html = "";

  for (const variation of component.variations) {
    const current = helpers.pathEqualsRequest(
      component.shortPath,
      variation,
      request
    );

    html += listItem.render(
      component,
      variationLink.render(isBuild, component, variation, current),
      "variation"
    );
  }

  return html;
}

module.exports = {
  render,
};
