/**
 * Helper functions for the render/menu module
 *
 * @module renderMenuHelpers
 */

import path from "path";

/*
 * Private functions
 */

/* Based on https://stackoverflow.com/a/14853974 */
/**
 * @param {Array} a - first array
 * @param {Array} b - second array
 * @returns {boolean} is true if both arrays are equal
 */
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

/*
 * Export functions
 */

const activeState = ' aria-current="page"';

/**
 * @param {string} currentPath - the current path in iterating over the menu
 * @param {string} requestedPath - the requested path by the user
 * @returns {boolean} is true if given path is parent of or equal requested path
 */
function pathIsParentOfOrEqualRequestedPath(currentPath, requestedPath) {
  if (!requestedPath) return false;
  if (!requestedPath.startsWith(currentPath)) return false;
  if (currentPath === requestedPath) return true;

  const requestedPathDirectories = requestedPath.split(path.sep);
  const currentPathDirectories = currentPath.split(path.sep);

  if (requestedPathDirectories.length === currentPathDirectories.length)
    return arraysAreEqual(currentPathDirectories, requestedPathDirectories);

  return true;
}

/**
 * @param {string} componentPath - the path of the current component in the menu iteration
 * @param {object} variation - the variation of the current component in the menu iteration
 * @param {object} request - the request object
 * @returns {boolean} is true if the current component and variation equals the request
 */
function pathEqualsRequest(componentPath, variation, request) {
  return request.path === componentPath && request.variation === variation.name;
}

/**
 * @param {object} directory - menu tree object
 * @returns {boolean} is true if the any of the children of the given directory also have children
 */
function childrenOfDirectoryContainDirectory(directory) {
  return (
    directory.children &&
    typeof directory.children !== "undefined" &&
    directory.children.filter((child) => child.type === "directory").length > 0
  );
}

/**
 * @param {object} component - menu tree object
 * @returns {boolean} is true if the given component has variations
 */
function componentHasVariations(component) {
  return (
    component.variations &&
    typeof component.variations !== "undefined" &&
    component.variations.length > 0
  );
}

/**
 * @param {object} directory - menu tree object
 * @returns {boolean} is true if the given directory is not in the first level
 */
function directoryIsNotTopLevel(directory) {
  return directory.index > 0;
}

/**
 * @param {object} directory - menu tree object
 * @returns {boolean} is true if the given directory is a component
 */
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

export default {
  activeState,
  childrenOfDirectoryContainDirectory,
  componentHasVariations,
  directoryHasComponent,
  directoryIsNotTopLevel,
  pathEqualsRequest,
  pathIsParentOfOrEqualRequestedPath,
};
