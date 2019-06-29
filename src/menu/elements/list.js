const classes = require("../classes.js");

function render(type, index, id, content) {
  let idAttr = id ? ` id="${id}"` : "";

  return `<ul class="${classes.list} ${classes.list}--lvl${index} ${
    classes.list
  }--${type}"${idAttr}>${content}</ul>`;
}

module.exports = {
  render
};
