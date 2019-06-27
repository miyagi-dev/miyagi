const classes = require("../classes.js");

function render(path, name, current, index) {
  return `<a class="${classes.component} ${classes.component}--lvl${index} ${
    classes.link
  } ${
    classes.link
  }--lvl${index}" target="iframe" href="?component=${path}&embedded=true"${current}>${name}</a>`;
}

module.exports = {
  render
};
