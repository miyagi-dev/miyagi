const classes = require("./_classes.js");

function render(type, index, content) {
  return `<ul class="${classes.list} ${classes.list}--lvl${index} ${classes.list}--${type}">${content}</ul>`;
}

module.exports = {
  render,
};
