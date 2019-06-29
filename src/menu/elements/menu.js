const menuStructure = require("../structure.js");
const list = require("./list.js");

function render(app, structure, request, id, index) {
  const children = menuStructure.getStructure(
    structure,
    app.get("config").extension
  );

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
