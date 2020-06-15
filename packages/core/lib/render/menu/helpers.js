/**
 * Helper functions for the render/menu module
 * @module render/menu/helpers
 */

const path = require("path");

/*
 * Private functions
 */

/* Based on https://stackoverflow.com/a/14853974 */
function arraysAreEqual(a, b) {
  // compare lengths - can save a lot of time
  if (a.length !== b.length) return false;

  for (let i = 0, l = a.length; i < l; i += 1) {
    if (a[i] !== b[i]) {
      // Warning - two different object instances will never be equal: {x:20} !== {x:20}
      return false;
    }
  }
  return true;
}

function reduceArrayToSameLengthOfOtherArray(a, b) {
  const aLength = a.length;

  return a.slice(0, aLength - (aLength - b.length));
}

function getDirectoriesArrayFromDirectoryPath(directoryPath, isFile) {
  let directorys = directoryPath.split(path.sep);

  if (isFile) {
    directorys = directorys.slice(0, directoryPath.split(path.sep).length - 1);
  }

  return directorys;
}

function getDirectoriesArrayFromFilePath(filePath) {
  return filePath.split(path.sep).slice(0, filePath.split(path.sep).length - 1);
}

/*
 * Export functions
 */

const activeState = ' aria-current="page"';

function pathIsChildOfSecondPath(child, parent, childIsFile) {
  if (!parent) return false;

  let parentDirectories = getDirectoriesArrayFromFilePath(parent);
  const childDirectories = getDirectoriesArrayFromDirectoryPath(
    child,
    childIsFile
  );

  parentDirectories = reduceArrayToSameLengthOfOtherArray(
    parentDirectories,
    childDirectories
  );

  return arraysAreEqual(childDirectories, parentDirectories);
}

function pathEqualsRequest(p, variation, request) {
  return request.path === p && request.variation === variation.name;
}

function childrenOfDirectoryContainDirectory(directory) {
  return (
    directory.children &&
    typeof directory.children !== "undefined" &&
    directory.children.filter((child) => child.type === "directory").length > 0
  );
}

function componentHasVariations(component) {
  return (
    component.variations &&
    typeof component.variations !== "undefined" &&
    component.variations.length > 0
  );
}

function directoryIsNotTopLevel(directory) {
  return directory.index > 0;
}

function directoryHasComponent(directory) {
  if (directory.shortPath) {
    if (
      typeof directory.shortPath !== "undefined" &&
      directory.shortPath.length > 0
    ) {
      return true;
    }
  }

  return false;
}

module.exports = {
  activeState,
  childrenOfDirectoryContainDirectory,
  componentHasVariations,
  directoryHasComponent,
  directoryIsNotTopLevel,
  pathEqualsRequest,
  pathIsChildOfSecondPath,
};
