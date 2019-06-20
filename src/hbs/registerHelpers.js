const getMenuHtml = require("./_getMenuHtml.js");

let app;

function partialPath(partial) {
  return partial;
}

function renderMenu(structure, currentComponent, currentVariation, id) {
  return getMenuHtml(app, structure, currentComponent, currentVariation, id);
}

function cssFiles() {
  let html = "";
  app.get("config").cssFiles.forEach(file => {
    html += `<link rel="stylesheet" href="${file}">`;
  });

  return html;
}

function jsFiles() {
  let html = "";
  app.get("config").jsFiles.forEach(file => {
    html += `<script src="${file}"></script>`;
  });

  return html;
}

module.exports = (appInstance, hbsInstance) => {
  app = appInstance;
  hbsInstance.registerHelper("partialPath", partialPath);
  hbsInstance.registerHelper("renderMenu", renderMenu);
  hbsInstance.registerHelper("cssFiles", cssFiles);
  hbsInstance.registerHelper("jsFiles", jsFiles);
};
