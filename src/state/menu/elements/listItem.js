const classes = require("../classes.js");

function render(item, content) {
  return `<li class="${classes.listItem} ${classes.listItem}--lvl${
    item.index
  }">${content}</li>`;
}

module.exports = {
  render
};
