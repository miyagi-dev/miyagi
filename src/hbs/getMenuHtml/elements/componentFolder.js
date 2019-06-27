const link = require("./link.js");
const toggle = require("./toggle.js");
const helpers = require("../helpers.js");

function render(folder, query) {
  let html = "";
  let currentAttr =
    query.path === folder.shortPath && !query.variation
      ? helpers.activeState
      : "";

  if (
    helpers.componentHasVariations(folder) ||
    helpers.childrenOfFolderContainDirectory(folder)
  ) {
    const expanded = helpers.pathIsChildOfSecondPath(
      folder.shortPath,
      query.path,
      true
    );

    html += toggle.render(folder.id, expanded, folder.index);
  }

  html += link.render(folder.shortPath, folder.name, currentAttr, folder.index);

  return html;
}

module.exports = {
  render
};
