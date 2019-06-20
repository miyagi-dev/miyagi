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
              index: s.index,
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
            children: s.children,
            index: s.index,
            id: s.path
              .replace(process.cwd().slice(1), "")
              .slice(1)
              .replace(/\//g, "-")
              .replace(/\./g, "-")
              .replace(/_/g, "")
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

function testIfCurrentComponentIsChildOfCurrentItem(
  shortPath,
  currentComponent
) {
  if (!currentComponent) return false;

  const currentComponentArr = currentComponent
    .split(path.sep)
    .slice(0, currentComponent.split(path.sep).length - 1);
  const currentItemArr = shortPath
    .split(path.sep)
    .slice(0, shortPath.split(path.sep).length - 1);
  const aLength = currentComponentArr.length;
  const bLength = currentItemArr.length;
  const diff = aLength - bLength;

  return currentItemArr.equals(currentComponentArr.slice(0, aLength - diff));
}

function testIfCurrentFolderIsChildOfCurrentItem(shortPath, currentComponent) {
  if (!currentComponent) return false;

  const currentComponentArr = currentComponent
    .split(path.sep)
    .slice(0, currentComponent.split(path.sep).length - 1);
  const currentItemArr = shortPath.split(path.sep);
  const aLength = currentComponentArr.length;
  const bLength = currentItemArr.length;
  const diff = aLength - bLength;

  return currentItemArr.equals(currentComponentArr.slice(0, aLength - diff));
}

function renderMenu(
  structure,
  currentComponent,
  currentVariation,
  id,
  shortPath,
  index,
  folderShortPath
) {
  const list = getNavStructure(structure);
  let html = "";

  if (list.length) {
    let idAttr = "";
    let hidden = "";
    let expanded = true;

    if (id) {
      idAttr = ` id="${id}"`;
    }

    if (shortPath) {
      expanded = testIfCurrentComponentIsChildOfCurrentItem(
        shortPath,
        currentComponent
      );
    } else if (index > 0) {
      expanded = testIfCurrentFolderIsChildOfCurrentItem(
        folderShortPath,
        currentComponent
      );
    }

    if (!expanded) {
      hidden = " hidden";
    }

    html += `<ul class="ComponentLibrary-list"${idAttr}${hidden}>`;

    list.forEach(child => {
      let current = "";
      html += '<li class="ComponentLibrary-listItem">';

      if (child.type === "directory") {
        let expanded = false;

        if (currentComponent === child.shortPath && !currentVariation) {
          current = ' aria-current="page"';
        }

        if (child.shortPath) {
          expanded = testIfCurrentComponentIsChildOfCurrentItem(
            child.shortPath,
            currentComponent
          );

          if (
            (child.variations && child.variations.length) ||
            (child.children &&
              child.children.filter(c => c.type === "directory").length)
          ) {
            html += `<button class="ComponentLibrary-toggle" aria-controls="${
              child.id
            }" aria-expanded="${expanded}" title="Toggle submenu"></button>`;
          }

          html += `<a class="ComponentLibrary-component ComponentLibrary-link" target="iframe" href="?component=${
            child.shortPath
          }"${current}>${child.name}</a>`;
        } else {
          if (
            child.children &&
            child.children.filter(child => child.type === "directory").length &&
            child.index > 0
          ) {
            if (child.index === 0) {
              expanded = true;
            } else {
              expanded = testIfCurrentFolderIsChildOfCurrentItem(
                child.path.replace(process.cwd().slice(1), "").slice(1),
                currentComponent
              );
            }

            html += `<button class="ComponentLibrary-toggle" aria-controls="${
              child.id
            }" aria-expanded="${expanded}" title="Toggle submenu"></button>`;
            html += `<span class="ComponentLibrary-component">${
              child.name
            }</span>`;
          } else {
            html += `<span class="ComponentLibrary-component is-disabled">${
              child.name
            }</span>`;
          }
        }

        if (child.variations && child.variations.length) {
          html += `<ul class="ComponentLibrary-list ComponentLibrary-list--variations" id="${
            child.id
          }" ${expanded ? "" : "hidden"}>`;
          child.variations.forEach(variation => {
            let current = "";
            if (
              currentComponent === child.shortPath &&
              currentVariation === variation.name
            ) {
              current = ' aria-current="page"';
            }

            html += '<li class="ComponentLibrary-listItem">';
            html += `<a class="ComponentLibrary-link ComponentLibrary-link--variation" target="iframe" href="?component=${
              child.shortPath
            }&variation=${encodeURI(variation.name)}"${current}>${
              variation.name
            }</a>`;
            html += "</li>";
          });
          html += "</ul>";
        }
      } else if (child.type === "file") {
        if (currentComponent === child.shortPath && !currentVariation) {
          current = ' aria-current="page"';
        }

        html += `<a class="ComponentLibrary-component ComponentLibrary-link" target="iframe" href="?component=${
          child.shortPath
        }"${current}>${child.name}</a>`;
      }

      if (child.children) {
        html += renderMenu(
          child.children,
          currentComponent,
          currentVariation,
          child.id,
          child.shortPath,
          child.index,
          child.path.replace(process.cwd().slice(1), "").slice(1)
        );
      }

      html += "</li>";
    });

    html += "</ul>";
  }

  return html;
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
