/**
 * Module for rendering a list in the menu
 * @module render/menu/list
 */

const classes = require("./classes.js");

function render(type, index, content) {
  return `<ul class="${classes.list} ${classes.list}--lvl${index} ${classes.list}--${type}">${content}</ul>`;
}

module.exports = {
  render,
};
