"use strict";

const path = require("path");
const getSourceStructure = require("./structure.js");
const helpers = require("../../helpers.js");

function getComponentFile(app, directory) {
  return directory.children.find(
    (child) =>
      path.basename(child.name) ==
      `${helpers.getResolvedFileName(
        app.get("config").files.templates.name,
        directory.name
      )}.${app.get("config").files.templates.extension}`
  );
}

function hasComponentFileWithCorrectNameAsChild(app, directory) {
  return (
    directory.children &&
    directory.children.length &&
    typeof getComponentFile(app, directory) !== "undefined"
  );
}

function getDataForLinkedDirectory(app, directory, partial) {
  const info = app.get("state").fileContents[
    helpers.getInfoPathFromTemplatePath(app, partial.path)
  ];

  return {
    type: directory.type,
    name: info && info.name ? info.name : directory.name,
    fullPath: partial.path,
    shortPath: partial.shortPath,
    normalizedShortPath: partial.normalizedShortPath,
    extension: partial.extension,
    variations: directory.variations || [],
    index: directory.index,
    id: helpers.normalizeString(partial.shortPath),
  };
}

function getDataForDirectory(directory) {
  return {
    type: directory.type,
    name: directory.name,
    fullPath: directory.path,
    index: directory.index,
    id: helpers.normalizeString(directory.shortPath),
  };
}

function restructureDirectory(app, directory) {
  let item;

  if (hasComponentFileWithCorrectNameAsChild(app, directory)) {
    item = getDataForLinkedDirectory(
      app,
      directory,
      getComponentFile(app, directory)
    );
  } else {
    item = getDataForDirectory(directory);
  }

  return item;
}

function hasChildren(item) {
  return item.children && item.children.length > 0;
}

function getMenu(app) {
  const srcStructure = getSourceStructure(app);

  const arr = [];

  (function restructure(structure, array) {
    for (const item of structure) {
      if (item.type === "directory") {
        const restructured = restructureDirectory(app, item);

        if (hasChildren(item)) {
          restructured.children = [];
          restructure(item.children, restructured.children);

          if (restructured.children.length === 0) {
            delete restructured.children;
          }
        }

        array.push(restructured);
      }
    }
  })(srcStructure, arr);

  return arr;
}

module.exports = {
  getMenu,
};
