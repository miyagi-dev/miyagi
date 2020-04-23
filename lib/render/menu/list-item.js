"use strict";

const classes = require("./_classes.js");

function render(item, content, type) {
  return `<li class="${classes.listItem} ${classes.listItem}--${type} ${classes.listItem}--lvl${item.index}">${content}</li>`;
}

module.exports = {
  render,
};
