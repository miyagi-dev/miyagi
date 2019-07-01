const component = require("./component.js");
const directory = require("./directory.js");
const listItem = require("./listItem.js");
const menu = require("./menu.js");
const helpers = require("../helpers.js");

function render(dir, request, app) {
  return listItem.render(
    dir,
    (() => {
      let html = "";

      if (helpers.directoryHasComponent(dir)) {
        html += component.render(dir, request);
      } else {
        html += directory.render(dir, request);
      }

      // starts recursion
      if (dir.children && dir.children.length) {
        html += menu.render(
          app,
          dir.children,
          request,
          dir.id,
          dir.children[0].index
        );
      }

      return html;
    })()
  );
}

module.exports = {
  render
};
