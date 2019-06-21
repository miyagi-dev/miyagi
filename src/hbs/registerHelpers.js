const getMenuHtml = require("./_getMenuHtml.js");

function partialPath(partial) {
  return partial;
}

function renderMenu(app, structure, path, variation, id) {
  return getMenuHtml(app, structure, { path, variation }, id);
}

function getCssFiles(app) {
  let html = "";

  app.get("config").cssFiles.forEach(file => {
    html += `<link rel="stylesheet" href="${file}">`;
  });

  return html;
}

function getJsFiles(app) {
  let html = "";

  app.get("config").jsFiles.forEach(file => {
    html += `<script src="${file}"></script>`;
  });

  return html;
}

module.exports = (app, hbs) => {
  hbs.registerHelper("partialPath", partialPath);

  hbs.registerHelper("renderMenu", (structure, path, variation, id) => {
    return renderMenu(app, structure, path, variation, id);
  });

  hbs.registerHelper("cssFiles", () => {
    return getCssFiles(app);
  });

  hbs.registerHelper("jsFiles", () => {
    return getJsFiles(app);
  });
};
