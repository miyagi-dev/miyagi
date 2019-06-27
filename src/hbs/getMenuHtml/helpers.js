const path = require("path");

/*
 * Private functions
 */

/* Based on https://stackoverflow.com/a/14853974 */
function arraysAreEqual(a, b) {
  // compare lengths - can save a lot of time
  if (a.length != b.length) return false;

  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] != b[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

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

/*
 * Export functions
 */

const activeState = ' aria-current="page"';

function pathIsChildOfSecondPath(child, parent, childIsFile) {
  if (!parent) return false;

  let parentFolders = getFoldersArrayFromFilePath(parent);
  let childFolders = getFoldersArrayFromFolderPath(child, childIsFile);

  parentFolders = reduceArrayToSameLengthOfOtherArray(
    parentFolders,
    childFolders
  );

  return arraysAreEqual(childFolders, parentFolders);
}

function pathEqualsRequest(path, variation, request) {
  return request.path === path && request.variation === variation.name;
}

function childrenOfFolderContainDirectory(folder) {
  return (
    folder.hasOwnProperty("children") &&
    typeof folder.children !== "undefined" &&
    folder.children.filter(child => child.type === "directory").length > 0
  );
}

function componentHasVariations(component) {
  return (
    component.hasOwnProperty("variations") &&
    typeof component.variations !== "undefined" &&
    component.variations.length > 0
  );
}

function folderIsNotTopLevel(folder) {
  return folder.index > 0;
}

function folderIsComponent(folder) {
  return (
    folder.hasOwnProperty("shortPath") &&
    typeof folder.shortPath !== "undefined" &&
    folder.shortPath.length > 0
  );
}

module.exports = {
  activeState,
  childrenOfFolderContainDirectory,
  componentHasVariations,
  folderIsComponent,
  folderIsNotTopLevel,
  pathEqualsRequest,
  pathIsChildOfSecondPath
};
