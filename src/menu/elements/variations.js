const listItem = require("./listItem.js");
const variationLink = require("./variationLink.js");
const helpers = require("../helpers.js");

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
      variationLink.render(component, variation, current)
    );
  });

  return html;
}

module.exports = {
  render
};
