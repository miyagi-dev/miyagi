const fs = require("fs");
const path = require("path");

let app;

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

function renderMenu(structure, currentPattern, currentVariation) {
  const list = getNavStructure(structure);
  let html = "";

  if (list) {
    html += '<ul class="Nav-list">';

    list.forEach(child => {
      let current = "";

      html += '<li class="Nav-item">';

      if (child.type === "file") {
        if (currentPattern === child.shortPath && !currentVariation) {
          current = ' aria-current="page"';
        }

        html += `<a class="Nav-link Nav-component" target="content" href="?pattern=${
          child.shortPath
        }"${current}>${child.name}</a>`;

        if (child.variations && child.variations.length) {
          html += '<ul class="Nav-list">';
          child.variations.forEach(variation => {
            let current = "";
            if (
              currentPattern === child.shortPath &&
              currentVariation === variation.name
            ) {
              current = ' aria-current="page"';
            }

            html += '<li class="Nav-item">';
            html += `<a class="Nav-link Nav-link--variation" target="content" href="?pattern=${
              child.shortPath
            }&variation=${encodeURI(variation.name)}"${current}>${
              variation.name
            }</a>`;
            html += "</li>";
          });
          html += "</ul>";
        }
      } else {
        html += `<span class="Nav-component${
          child.extension !== app.get("config").extension ? " is-disabled" : ""
        }">${child.name}</span>`;
      }

      if (
        child.children &&
        child.children.length &&
        child.children.filter(child => child.type === "directory").length
      ) {
        html += renderMenu(child.children, currentPattern, currentVariation);
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
      console.warn(`WARNING: CSS file ${filePath} not found.`);
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
      console.warn(`WARNING: JS file ${filePath} not found.`);
    }

    html += readFile;
  });
  html += "</script>";
  return html;
}

module.exports = (appInstance, hbsInstance) => {
  app = appInstance;
  hbsInstance.registerHelper("partialPath", partialPath);
  hbsInstance.registerHelper("renderMenu", renderMenu);
  hbsInstance.registerHelper("cssFiles", cssFiles);
  hbsInstance.registerHelper("jsFiles", jsFiles);
};
