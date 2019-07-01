const menu = require("../state/menu/elements/menu.js");

function partialPath(partial) {
  return partial;
}

function renderMenu(app, children, path, variation, id) {
  return menu.render(app, children, { path, variation }, id);
}

function getCssFilesHtml(files) {
  let html = "";

  files.forEach(file => {
    html += `<link rel="stylesheet" href="${file}">`;
  });

  return html;
}

function getJsFilesHtml(files) {
  let html = "";

  files.forEach(file => {
    html += `<script src="${file}" defer></script>`;
  });

  return html;
}

module.exports = (app, hbs) => {
  hbs.registerHelper("partialPath", partialPath);

  hbs.registerHelper("renderMenu", (structure, path, variation, id) => {
    return renderMenu(app, structure, path, variation, id);
  });

  hbs.registerHelper("cssFiles", () => {
    return getCssFilesHtml(app.get("config").cssFiles);
  });

  hbs.registerHelper("jsFiles", () => {
    return getJsFilesHtml(app.get("config").jsFiles);
  });
};
