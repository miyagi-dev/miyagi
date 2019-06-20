const path = require("path");
const getNavStructure = require("./_getNavStructure.js");
require("./_helpers.js");

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

function renderToggle(id, expanded, index) {
  return `<button class="ComponentLibrary-toggle ComponentLibrary-toggle--lvl${index}" aria-controls="${id}" aria-expanded="${expanded}" title="Toggle submenu"></button>`;
}

function renderLink(path, name, current, index) {
  return `<a class="ComponentLibrary-component ComponentLibrary-component--lvl${index} ComponentLibrary-link ComponentLibrary-link--lvl${index}" target="iframe" href="?component=${path}"${current}>${name}</a>`;
}

function getMenuHtml(
  app,
  structure,
  currentComponent,
  currentVariation,
  id,
  index = 0
) {
  const list = getNavStructure(structure, app.get("config").extension);
  let html = "";

  if (list.length) {
    let idAttr = "";

    if (id) {
      idAttr = ` id="${id}"`;
    }

    html += `<ul class="ComponentLibrary-list ComponentLibrary-list--lvl${index} ComponentLibrary-list--components"${idAttr}>`;

    list.forEach(child => {
      let current = "";
      html += `<li class="ComponentLibrary-listItem ComponentLibrary-listItem--lvl${
        child.index
      }">`;

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
            html += renderToggle(child.id, expanded, child.index);
          }

          html += renderLink(child.shortPath, child.name, current, child.index);
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

            html += renderToggle(child.id, expanded, child.index);
            html += `<span class="ComponentLibrary-component ComponentLibrary-component--lvl${
              child.index
            }">${child.name}</span>`;
          } else {
            html += `<span class="ComponentLibrary-component ComponentLibrary-component--lvl${
              child.index
            } is-disabled">${child.name}</span>`;
          }
        }

        if (child.variations && child.variations.length) {
          html += `<ul class="ComponentLibrary-list ComponentLibrary-list--lvl${
            child.index
          } ComponentLibrary-list--variations" id="${child.id}">`;
          child.variations.forEach(variation => {
            let current = "";
            if (
              currentComponent === child.shortPath &&
              currentVariation === variation.name
            ) {
              current = ' aria-current="page"';
            }

            html += `<li class="ComponentLibrary-listItem ComponentLibrary-listItem--lvl${
              child.index
            }">`;
            html += `<a class="ComponentLibrary-link ComponentLibrary-link--lvl${
              child.index
            } ComponentLibrary-link--variation" target="iframe" href="?component=${
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

        html += renderLink(child.shortPath, child.name, current, child.index);
      }

      if (child.children) {
        html += getMenuHtml(
          app,
          child.children,
          currentComponent,
          currentVariation,
          child.id,
          child.children.length ? child.children[0].index : null
        );
      }

      html += "</li>";
    });

    html += "</ul>";
  }

  return html;
}

module.exports = getMenuHtml;
