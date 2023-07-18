/**
 * Module for creating a menu object
 *
 * @module stateMenu
 */

const path = require("path");
const getSourceStructure = require("./structure.js");
const helpers = require("../../helpers.js");

/**
 * @param {object} app - the express instance
 * @param {object} directory - file tree object
 * @returns {Array} file tree object of the component file in the given directory
 */
function getComponentFiles(app, directory) {
  return directory.children.filter((child) => {
    const baseName =
      app.get("config").files.templates.name === "<component>"
        ? child.name.replace(
            `.${app.get("config").files.templates.extension}`,
            ""
          )
        : app.get("config").files.templates.name;

    if (helpers.fileIsDocumentationFile(app, child.name)) return true;

    if (helpers.fileIsTemplateFile(app, child.name)) {
      if (
        app.get("config").files.templates.name === "<component>" &&
        directory.name === baseName
      )
        return true;

      if (app.get("config").files.templates.name === baseName) return true;
    }

    return false;
  });
}

/**
 * @param {object} app - the express instance
 * @param {object} directory - file tree object
 * @returns {boolean} returns true if the given directory has a component file with the same name
 */
function hasComponentFileWithCorrectNameAsChild(app, directory) {
  return (
    directory.children &&
    directory.children.length &&
    getComponentFiles(app, directory).length > 0
  );
}

/**
 * @param {object} app - the express instance
 * @param {object} directory - file tree object
 * @returns {object} adapted file tree object
 */
function getDataForLinkedDirectory(app, directory) {
  const info =
    app.get("state").fileContents[
      path.join(
        directory.path,
        `${app.get("config").files.info.name}.${
          app.get("config").files.info.extension
        }`
      )
    ];
  const shortPath = helpers.getShortPathFromFullPath(app, directory.path);
  const normalizedShortPath = helpers.normalizeString(shortPath);

  return {
    type: directory.type,
    name: info && info.name ? info.name : directory.name,
    fullPath: directory.path,
    shortPath,
    normalizedShortPath,
    variations: directory.variations || [],
    index: directory.index,
    id: helpers.normalizeString(directory.path),
  };
}

/**
 * @param {object} app - the express instance
 * @param {object} directory - file tree object
 * @returns {object} adapted file tree object
 */
function getDataForDirectory(app, directory) {
  const info =
    app.get("state").fileContents[
      path.join(
        directory.path,
        `${app.get("config").files.info.name}.${
          app.get("config").files.info.extension
        }`
      )
    ];

  return {
    type: directory.type,
    name: info && info.name ? info.name : directory.name,
    fullPath: directory.path,
    index: directory.index,
    id: helpers.normalizeString(directory.path),
  };
}

/**
 * @param {object} app - the express instance
 * @param {object} directory - file tree object
 * @returns {object} adapted file tree object
 */
function restructureDirectory(app, directory) {
  let item;

  if (hasComponentFileWithCorrectNameAsChild(app, directory)) {
    item = getDataForLinkedDirectory(app, directory);
  } else {
    item = getDataForDirectory(app, directory);
  }

  return item;
}

/**
 * @param {object} item - file tree object
 * @returns {boolean} returns true if the given file tree object has children
 */
function hasChildren(item) {
  return item.children && item.children.length > 0;
}

/**
 * @param {object} app - the express instance
 * @returns {object[]} array with adapted menu items
 */
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

          if (restructured.children) {
            restructured.children.sort(function (a, b) {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();

              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;

              return 0;
            });
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
