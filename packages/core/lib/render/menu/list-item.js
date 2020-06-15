/**
 * Module for rendering a list item in the menu
 * @module render/menu/list-item
 */

const classes = require("./classes.js");

function render(item, content, type) {
  return `<li class="${classes.listItem} ${classes.listItem}--${type} ${classes.listItem}--lvl${item.index}">${content}</li>`;
}

module.exports = {
  render,
};
