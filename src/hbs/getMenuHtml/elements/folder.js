const componentFolder = require("./componentFolder.js");
const disabledComponent = require("./disabledComponent.js");
const toggle = require("./toggle.js");
const variations = require("./variations.js");
const helpers = require("../helpers.js");

function render(folder, request) {
  let html = "";

  if (helpers.folderIsComponent(folder)) {
    html += componentFolder.render(folder, request);

    if (helpers.componentHasVariations(folder)) {
      html += variations.render(folder, request);
    }
  } else {
    if (
      helpers.childrenOfFolderContainDirectory(folder) &&
      helpers.folderIsNotTopLevel(folder)
    ) {
      const expanded = helpers.pathIsChildOfSecondPath(
        folder.path.replace(process.cwd().slice(1), "").slice(1),
        request.path
      );

      html += toggle.render(folder.id, expanded, folder.index);
    }

    html += disabledComponent.render(folder);
  }

  return html;
}

module.exports = {
  render
};
