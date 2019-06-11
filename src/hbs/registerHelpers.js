const fs = require("fs");
const path = require("path");

let app;
let expr;

function partialPath(partial) {
  return partial;
}

function getNavStructure(srcStructure) {
  const arr = [];

  (function restructure(str) {
    str.forEach(s => {
      if (
        s.children &&
        s.children.length &&
        s.children.filter(
          child =>
            child.name.replace(`.${app.get("config").extension}`, "") ===
              s.name && child.extension === `.${app.get("config").extension}`
        )[0]
      ) {
        const partial = s.children.filter(
          child =>
            child.name.replace(`.${app.get("config").extension}`, "") ===
              s.name && child.extension === `.${app.get("config").extension}`
        )[0];

        if (partial) {
          arr.push({
            type: partial.type,
            name: s.name,
            path: partial.path,
            shortPath: partial.shortPath,
            extension: partial.extension,
            variations: s.variations,
            children: s.children
          });
        }
      } else if (s.type === "directory") {
        arr.push({
          type: s.type,
          name: s.name,
          path: s.path,
          shortPath: s.shortPath,
          extension: s.extension,
          children: s.children
        });
      }

      if (str.children && str.children.length > 1) {
        restructure(str);
      }
    });
  })(srcStructure);

  return arr;
}

function renderMenu(structure) {
  const list = getNavStructure(structure);
  let html = "";

  if (list) {
    html += '<ul class="Navigation">';

    list.forEach(child => {
      html += '<li class="Navigation-item">';

      if (child.type === "file") {
        html += `<a class="Navigation-link Navigation-component" target="content" href="?pattern=${
          child.shortPath
        }">${child.name}</a>`;

        if (child.variations && child.variations.length) {
          html += '<ul class="Navigation Navigation--variations">';
          child.variations.forEach(variation => {
            html += '<li class="Navigation-item">';
            html += `<a class="Navigation-link Navigation-link--variation" target="content" href="?pattern=${
              child.shortPath
            }&variation=${encodeURI(variation.name)}">${variation.name}</a>`;
            html += "</li>";
          });
          html += "</ul>";
        }
      } else {
        html += `<span class="Navigation-component${
          child.extension !== app.get("config").extension ? " is-disabled" : ""
        }">${child.name}</span>`;
      }

      if (
        child.children &&
        child.children.length &&
        child.children.filter(child => child.type === "directory").length
      ) {
        html += renderMenu(child.children);
      }

      html += "</li>";
    });

    html += "</ul>";
  }

  return html;
}

function cssFiles() {
  let html = "<style>";
  app.get("config").cssFiles.forEach(file => {
    const sanitizedFilePath = file.replace(/\0/g, "");
    const filePath = path.join(process.cwd(), sanitizedFilePath);
    let readFile;

    try {
      readFile = fs.readFileSync(filePath, "utf8");
    } catch (e) {
      console.log(`CSS file ${filePath} not found.`);
    }

    html += readFile;
  });
  html += "</style>";
  return html;
}

function jsFiles() {
  let html = "<script>";
  app.get("config").jsFiles.forEach(file => {
    const sanitizedFilePath = file.replace(/\0/g, "");
    const filePath = path.join(process.cwd(), sanitizedFilePath);
    let readFile;

    try {
      readFile = fs.readFileSync(filePath, "utf8");
    } catch (e) {
      console.log(`JS file ${filePath} not found.`);
    }

    html += readFile;
  });
  html += "</script>";
  return html;
}

module.exports = (appInstance, hbsInstance, express) => {
  app = appInstance;
  expr = express;
  hbsInstance.registerHelper("partialPath", partialPath);
  hbsInstance.registerHelper("renderMenu", renderMenu);
  hbsInstance.registerHelper("cssFiles", cssFiles);
  hbsInstance.registerHelper("jsFiles", jsFiles);
};
