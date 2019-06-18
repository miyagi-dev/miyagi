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
      if (s.type === "directory") {
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
              type: s.type,
              name: partial.name,
              path: partial.path,
              shortPath: partial.shortPath,
              extension: partial.extension,
              variations: s.variations,
              children: s.children,
              id: partial.shortPath
                .replace(/\//g, "-")
                .replace(/\./g, "-")
                .replace(/_/g, "")
            });
          }
        } else {
          arr.push({
            type: s.type,
            name: s.name,
            path: s.path,
            shortPath: s.shortPath,
            extension: s.extension,
            children: s.children,
            id: s.shortPath
              ? s.shortPath
                  .replace(/\//g, "-")
                  .replace(/\./g, "-")
                  .replace(/_/g, "")
              : ""
          });
        }
      }

      if (str.children && str.children.length > 1) {
        restructure(str);
      }
    });
  })(srcStructure);

  return arr;
}

// Warn if overriding existing method
if (Array.prototype.equals)
  console.warn(
    "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
  );
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

function testIfCurrentPatternIsChildOfCurrentItem(shortPath, currentPattern) {
  if (!currentPattern) return false;

  const currentPatternArr = currentPattern
    .split(path.sep)
    .slice(0, currentPattern.split(path.sep).length - 1);
  const currentItemArr = shortPath
    .split(path.sep)
    .slice(0, shortPath.split(path.sep).length - 1);
  const aLength = currentPatternArr.length;
  const bLength = currentItemArr.length;
  const diff = aLength - bLength;

  return currentItemArr.equals(currentPatternArr.slice(0, aLength - diff));
}

function renderMenu(
  structure,
  currentPattern,
  currentVariation,
  id,
  shortPath
) {
  const list = getNavStructure(structure);
  let html = "";

  if (list.length) {
    let test = "";
    let hidden = "";
    let expanded = true;

    if (id) {
      test = ` id="${id}"`;
    }

    if (shortPath) {
      expanded = testIfCurrentPatternIsChildOfCurrentItem(
        shortPath,
        currentPattern
      );
    }

    if (!expanded) {
      hidden = " hidden";
    }

    html += `<ul class="ComponentLibraryNav-list"${test}${hidden}>`;

    list.forEach(child => {
      let current = "";

      html += '<li class="ComponentLibraryNav-item">';

      if (child.type === "directory") {
        let expanded = false;

        if (currentPattern === child.shortPath && !currentVariation) {
          current = ' aria-current="page"';
        }

        if (child.shortPath) {
          expanded = testIfCurrentPatternIsChildOfCurrentItem(
            child.shortPath,
            currentPattern
          );

          if (
            (child.variations && child.variations.length) ||
            (child.children &&
              child.children.filter(c => c.type === "directory").length)
          ) {
            html += `<button class="ComponentLibraryNav-toggle" aria-controls="${
              child.id
            }" aria-expanded="${expanded}" title="Toggle submenu"></button>`;
          }

          html += `<a class="ComponentLibraryNav-component ComponentLibraryNav-link" href="?pattern=${
            child.shortPath
          }"${current}>${child.name}</a>`;
        } else {
          html += `<span class="ComponentLibraryNav-component is-disabled">${
            child.name
          }</span>`;
        }

        if (child.variations && child.variations.length) {
          html += `<ul class="ComponentLibraryNav-list" id="${child.id}" ${
            expanded ? "" : "hidden"
          }>`;
          child.variations.forEach(variation => {
            let current = "";
            if (
              currentPattern === child.shortPath &&
              currentVariation === variation.name
            ) {
              current = ' aria-current="page"';
            }

            html += '<li class="ComponentLibraryNav-item">';
            html += `<a class="ComponentLibraryNav-link ComponentLibraryNav-link--variation" target="content" href="?pattern=${
              child.shortPath
            }&variation=${encodeURI(variation.name)}"${current}>${
              variation.name
            }</a>`;
            html += "</li>";
          });
          html += "</ul>";
        }
      } else if (child.type === "file") {
        if (currentPattern === child.shortPath && !currentVariation) {
          current = ' aria-current="page"';
        }

        html += `<a class="ComponentLibraryNav-component ComponentLibraryNav-link" target="content" href="?pattern=${
          child.shortPath
        }"${current}>${child.name}</a>`;
      }

      if (child.children) {
        html += renderMenu(
          child.children,
          currentPattern,
          currentVariation,
          child.id,
          child.shortPath
        );
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
