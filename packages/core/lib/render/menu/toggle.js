/**
 * Module for rendering a toggle button in the menu
 *
 * @module renderMenuToggle
 */

import classes from "./classes.js";

/**
 * Renders a toggle button for a list in the menu
 *
 * @param {string} id - the id of the element the toggle button controls
 * @param {boolean} expanded - describes the expanded state
 * @param {number} index - the depth level of the list which the button controls, used for styling
 * @returns {string} the html with the toggle button
 */
export const render = function (id, expanded, index) {
  return `<button class="${classes.toggle} ${classes.toggle}--lvl${index}" aria-controls="${id}" aria-expanded="${expanded}" title="Toggle submenu"></button>`;
};
