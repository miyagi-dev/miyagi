const menu = require("./elements/index.js");

function render(app, structure, request, id, index = 0) {
  return menu.render(app, structure, request, id, index);
}

module.exports = {
  render
};
