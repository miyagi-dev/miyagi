const toggle = require("./toggle.js");
const variations = require("./variations.js");
const list = require("./list.js");
const helpers = require("../helpers.js");
const classes = require("../classes.js");

function render(component, request) {
  const hasVariations = helpers.componentHasVariations(component);
  let html = "";
  let current = request.path === component.shortPath && !request.variation;

  if (hasVariations || helpers.childrenOfDirectoryContainDirectory(component)) {
    const expanded = helpers.pathIsChildOfSecondPath(
      component.shortPath,
      request.path,
      true
    );

    html += toggle.render(component.id, expanded, component.index);
  }

  html += `<a class="${classes.component} ${classes.component}--lvl${
    component.index
  } ${classes.link} ${classes.link}--lvl${
    component.index
  }" target="iframe" href="?component=${component.shortPath}&embedded=true"${
    current ? helpers.activeState : ""
  }>${component.name}</a>`;

  if (hasVariations) {
    html += list.render(
      "variations",
      component.index,
      component.id,
      variations.render(component, request)
    );
  }

  return html;
}

module.exports = {
  render
};
