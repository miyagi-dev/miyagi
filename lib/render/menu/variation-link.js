"use strict";

const classes = require("./_classes.js");
const helpers = require("./_helpers.js");

function render(component, variation, current) {
  return `<a class="${classes.link} ${classes.link}--lvl${component.index} ${
    classes.link
  }--variation" target="iframe" href="/component?file=${
    component.shortPath
  }&variation=${encodeURI(variation.name)}&embedded=true"${
    current ? helpers.activeState : ""
  }>${variation.name}</a>`;
}

module.exports = {
  render
};
