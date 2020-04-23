"use strict";

const classes = require("./_classes.js");

function render(id, expanded, index) {
  return `<button class="${classes.toggle} ${classes.toggle}--lvl${index}" aria-controls="${id}" aria-expanded="${expanded}" title="Toggle submenu"></button>`;
}

module.exports = {
  render,
};
