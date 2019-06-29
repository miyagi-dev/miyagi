const classes = require("../classes.js");
const helpers = require("../helpers.js");

function render(component, variation, current) {
  return `<a class="${classes.link} ${classes.link}--lvl${component.index} ${
    classes.link
  }--variation" target="iframe" href="?component=${
    component.shortPath
  }&variation=${encodeURI(variation.name)}&embedded=true"${
    current ? helpers.activeState : ""
  }>${variation.name}</a>`;
}

module.exports = {
  render
};
