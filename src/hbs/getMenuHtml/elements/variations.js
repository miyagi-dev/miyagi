const list = require("./list.js");
const listItem = require("./listItem.js");
const variationLink = require("./variationLink.js");
const helpers = require("../helpers.js");

function render(child, request) {
  let html = list.render("variations", child.index, child.id);

  child.variations.forEach(variation => {
    let current = "";

    if (helpers.pathEqualsRequest(child.shortPath, variation, request)) {
      current = helpers.activeState;
    }

    html += listItem.render(child);
    html += variationLink.render(child, variation, current);
    html += "</li>";
  });

  html += "</ul>";

  return html;
}

module.exports = {
  render
};
