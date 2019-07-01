const list = require("./list.js");

function render(app, children, request, id, index) {
  if (children.length) {
    return list.render(
      "components",
      index,
      id,
      (() => {
        let html = "";

        children.forEach(child => {
          html += require("./menuItem.js").render(child, request, app);
        });

        return html;
      })()
    );
  }

  return "";
}

module.exports = {
  render
};
