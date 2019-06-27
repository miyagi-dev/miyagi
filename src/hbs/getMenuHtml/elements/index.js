const navStructure = require("../navStructure.js");
const list = require("./list.js");

function render(app, structure, request, id, index) {
  const children = navStructure.getStructure(
    structure,
    app.get("config").extension
  );
  let html = "";

  if (children.length) {
    html += list.render("components", index, id);

    children.forEach(child => {
      html += require("./child.js").render(child, request, app);
    });

    html += "</ul>";
  }

  return html;
}

module.exports = {
  render
};
