const classes = require("../classes.js");

function render(child) {
  return `<li class="${classes.listItem} ${classes.listItem}--lvl${
    child.index
  }">`;
}

module.exports = {
  render
};
