const classes = require("../classes.js");

function render(child) {
  return `<span class="${classes.component} ${classes.component}--lvl${
    child.index
  }">${child.name}</span>`;
}

module.exports = {
  render
};
