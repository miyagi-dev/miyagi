const link = require("./link.js");
const { activeState } = require("../helpers.js");

function render(child, request) {
  let current = "";

  if (request.path === child.shortPath && !request.variation) {
    current = activeState;
  }

  return link.render(child.shortPath, child.name, current, child.index);
}

module.exports = {
  render
};
