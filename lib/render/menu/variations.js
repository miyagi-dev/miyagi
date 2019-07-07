"use strict";

const listItem = require("./list-item.js");
const variationLink = require("./variation-link.js");
const helpers = require("./_helpers.js");

function render(component, request) {
  let html = "";

  component.variations.forEach(variation => {
    const current = helpers.pathEqualsRequest(
      component.shortPath,
      variation,
      request
    );

    html += listItem.render(
      component,
      variationLink.render(component, variation, current),
      "variation"
    );
  });

  return html;
}

module.exports = {
  render
};
