const classes = require("../classes.js");

function render(child, variation, current) {
  return `<a class="${classes.link} ${classes.link}--lvl${child.index} ${
    classes.link
  }--variation" target="iframe" href="?component=${
    child.shortPath
  }&variation=${encodeURI(variation.name)}&embedded=true"${current}>${
    variation.name
  }</a>`;
}

module.exports = {
  render
};
