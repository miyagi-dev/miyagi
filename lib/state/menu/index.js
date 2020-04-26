"use strict";

const path = require("path");
const getSourceStructure = require("./structure.js");
const helpers = require("../../helpers.js");

function getComponentFile(directory, templateExtension) {
  return directory.children.find(
    (child) =>
      path.basename(child.name, `.${templateExtension}`) === directory.name &&
      child.extension === `.${templateExtension}`
  );
}

function hasComponentFileWithCorrectNameAsChild(directory, templateExtension) {
  return (
    directory.children &&
    directory.children.length &&
    typeof getComponentFile(directory, templateExtension) !== "undefined"
  );
}

function getDataForLinkedDirectory(app, directory, partial) {
  const data = app.get("state").fileContents[
    helpers.getDataPathFromTemplatePath(app, partial.path)
  ];

  return {
    type: directory.type,
    name: data && data.name ? data.name : directory.name,
    fullPath: partial.path,
    shortPath: partial.shortPath,
    normalizedShortPath: partial.normalizedShortPath,
    extension: partial.extension,
    variations: directory.variations,
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

function restructureDirectory(app, directory, templateExtension) {
  let item;

  if (hasComponentFileWithCorrectNameAsChild(directory, templateExtension)) {
    item = getDataForLinkedDirectory(
      app,
      directory,
      getComponentFile(directory, templateExtension)
    );
  } else {
    item = getDataForDirectory(directory);
  }

  return item;
}

function hasChildren(item) {
  return item.children && item.children.length > 1;
}

function getMenu(app) {
  const srcStructure = getSourceStructure(app);
  const templateExtension = app.get("config").extension;
  const arr = [];

  (function restructure(structure, array) {
    structure.forEach((item) => {
      if (item.type === "directory") {
        const restructured = restructureDirectory(app, item, templateExtension);

        if (hasChildren(item)) {
          restructured.children = [];
          restructure(item.children, restructured.children);
        }

        array.push(restructured);
      }
    });
  })(srcStructure, arr);

  return arr;
}

module.exports = {
  getMenu,
};
