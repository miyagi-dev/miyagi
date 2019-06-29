const toggle = require("./toggle.js");
const helpers = require("../helpers.js");
const classes = require("../classes.js");

function render(directory, request) {
  let html = "";

  if (
    helpers.childrenOfDirectoryContainDirectory(directory) &&
    helpers.directoryIsNotTopLevel(directory)
  ) {
    const expanded = helpers.pathIsChildOfSecondPath(
      directory.path.replace(process.cwd().slice(1), "").slice(1),
      request.path
    );

    html += toggle.render(directory.id, expanded, directory.index);
  }

  html += `<span class="${classes.component} ${classes.component}--lvl${
    directory.index
  }">${directory.name}</span>`;

  return html;
}

module.exports = {
  render
};
