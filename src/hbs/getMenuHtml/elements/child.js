const file = require("./file.js");
const folder = require("./folder.js");
const menu = require("./index.js");
const listItem = require("./listItem.js");

function render(child, request, app) {
  let html = listItem.render(child);

  html += (child.type === "directory" ? folder.render : file.render)(
    child,
    request
  );

  if (child.children && child.children.length) {
    html += menu.render(
      app,
      child.children,
      request,
      child.id,
      child.children[0].index
    );
  }

  html += "</li>";

  return html;
}

module.exports = {
  render
};
