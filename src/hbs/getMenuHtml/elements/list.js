const classes = require("../classes.js");

function render(type, index, id) {
  let idAttr = "";

  if (id) {
    idAttr = ` id="${id}"`;
  }

  return `<ul class="${classes.list} ${classes.list}--lvl${index} ${
    classes.list
  }--${type}"${idAttr}>`;
}

module.exports = {
  render
};
