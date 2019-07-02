const toggle = require("./toggle.js");
const helpers = require("../helpers.js");
const classes = require("../classes.js");

function render(directory, request) {
  let html = "";

  if (
    helpers.childrenOfDirectoryContainDirectory(directory) &&
    helpers.directoryIsNotTopLevel(directory)
  ) {
    let child = directory.path.replace(process.cwd().slice(1), "");

    const expanded = helpers.pathIsChildOfSecondPath(
      child.slice(-1) === "/" ? child.slice(1) : child,
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
