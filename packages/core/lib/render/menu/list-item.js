/**
 * Module for rendering a list item in the menu
 *
 * @module renderMenuListitem
 */

import classes from "./classes.js";

/**
 * Renders a list element with given content in the menu
 *
 * @param {number} index - the depth level of the list in the menu
 * @param {string} content - the html string for the content of list item
 * @param {string} type - can be "directory" or "variation"
 * @returns {string} the html of the list item
 */
export const render = function (index, content, type) {
  return `<li class="${classes.listItem} ${classes.listItem}--${type} ${classes.listItem}--lvl${index}">${content}</li>`;
};
