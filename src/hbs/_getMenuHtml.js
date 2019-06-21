const path = require("path");
const getNavStructure = require("./_getNavStructure.js");
require("../arrayEquals.js");

const classes = {
  toggle: "ComponentLibrary-toggle",
  component: "ComponentLibrary-component",
  link: "ComponentLibrary-link",
  list: "ComponentLibrary-list",
  listItem: "ComponentLibrary-listItem"
};
const activeState = ' aria-current="page"';

function reduceArrayToSameLengthOfOtherArray(a, b) {
  const aLength = a.length;

  return a.slice(0, aLength - (aLength - b.length));
}

function getFoldersArrayFromFolderPath(folderPath, isFile) {
  let folders = folderPath.split(path.sep);

  if (isFile) {
    folders = folders.slice(0, folderPath.split(path.sep).length - 1);
  }

  return folders;
}

function getFoldersArrayFromFilePath(filePath) {
  return filePath.split(path.sep).slice(0, filePath.split(path.sep).length - 1);
}

function pathIsPartofRequestedPath(
  currentPath,
  requestedPath,
  currentPathIsFile
) {
  if (!requestedPath) return false;

  let requestedPathFolders = getFoldersArrayFromFilePath(requestedPath);
  let currentPathFolders = getFoldersArrayFromFolderPath(
    currentPath,
    currentPathIsFile
  );

  requestedPathFolders = reduceArrayToSameLengthOfOtherArray(
    requestedPathFolders,
    currentPathFolders
  );

  return currentPathFolders.equals(requestedPathFolders);
}

function pathEqualsRequest(path, variation, request) {
  return request.path === path && request.variation === variation.name;
}

function hasDirectoryAsChild(folder) {
  return (
    folder.children &&
    folder.children.filter(child => child.type === "directory").length
  );
}

function hasVariations(component) {
  return component.variations && component.variations.length;
}

function isNotTopLevel(folder) {
  return folder.index > 0;
}

function isComponent(folder) {
  return folder.shortPath;
}

function getToggleHtml(id, expanded, index) {
  return `<button class="${classes.toggle} ${
    classes.toggle
  }--lvl${index}" aria-controls="${id}" aria-expanded="${expanded}" title="Toggle submenu"></button>`;
}

function getListHtml(type, index, id) {
  let idAttr = "";

  if (id) {
    idAttr = ` id="${id}"`;
  }

  return `<ul class="${classes.list} ${classes.list}--lvl${index} ${
    classes.list
  }--${type}"${idAttr}>`;
}

function getListItemHtml(child) {
  return `<li class="${classes.listItem} ${classes.listItem}--lvl${
    child.index
  }">`;
}

function getLinkHtml(path, name, current, index) {
  return `<a class="${classes.component} ${classes.component}--lvl${index} ${
    classes.link
  } ${
    classes.link
  }--lvl${index}" target="iframe" href="?component=${path}"${current}>${name}</a>`;
}

function getVariationLinkHtml(child, variation, current) {
  return `<a class="${classes.link} ${classes.link}--lvl${child.index} ${
    classes.link
  }--variation" target="iframe" href="?component=${
    child.shortPath
  }&variation=${encodeURI(variation.name)}"${current}>${variation.name}</a>`;
}

function getVariationsHtml(child, request) {
  let html = getListHtml("variations", child.index, child.id);

  child.variations.forEach(variation => {
    let current = "";

    if (pathEqualsRequest(child.shortPath, variation, request)) {
      current = activeState;
    }

    html += getListItemHtml(child);
    html += getVariationLinkHtml(child, variation, current);
    html += "</li>";
  });
  html += "</ul>";

  return html;
}

function getDisabledComponentHtml(child) {
  return `<span class="${classes.component} ${classes.component}--lvl${
    child.index
  }">${child.name}</span>`;
}

function getComponentFolderHtml(folder, request) {
  let html = "";
  let current =
    request.path === folder.shortPath && !request.variation ? activeState : "";

  if (hasVariations(folder) || hasDirectoryAsChild(folder)) {
    const expanded = pathIsPartofRequestedPath(
      folder.shortPath,
      request.path,
      true
    );

    html += getToggleHtml(folder.id, expanded, folder.index);
  }

  html += getLinkHtml(folder.shortPath, folder.name, current, folder.index);

  return html;
}

function getFolderHtml(folder, request) {
  let html = "";

  if (isComponent(folder)) {
    html += getComponentFolderHtml(folder, request);
  } else {
    if (hasDirectoryAsChild(folder) && isNotTopLevel(folder)) {
      const expanded = pathIsPartofRequestedPath(
        folder.path.replace(process.cwd().slice(1), "").slice(1),
        request.path
      );

      html += getToggleHtml(folder.id, expanded, folder.index);
    }

    html += getDisabledComponentHtml(folder);
  }

  if (hasVariations(folder)) {
    html += getVariationsHtml(folder, request);
  }

  return html;
}

function getFileHtml(child, request) {
  let current = "";

  if (request.path === child.shortPath && !request.variation) {
    current = activeState;
  }

  return getLinkHtml(child.shortPath, child.name, current, child.index);
}

function getChildHtml(child, request, app) {
  let html = getListItemHtml(child);

  html += (child.type === "directory" ? getFolderHtml : getFileHtml)(
    child,
    request
  );

  if (child.children) {
    html += getHtml(
      app,
      child.children,
      request,
      child.id,
      child.children.length ? child.children[0].index : null
    );
  }

  html += "</li>";

  return html;
}

function getHtml(app, structure, request, id, index = 0) {
  const children = getNavStructure(structure, app.get("config").extension);
  let html = "";

  if (children.length) {
    html += getListHtml("components", index, id);

    children.forEach(child => {
      html += getChildHtml(child, request, app);
    });

    html += "</ul>";
  }

  return html;
}

module.exports = getHtml;
