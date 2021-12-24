/**
 * Module for rendering a list of variations in the menu
 *
 * @module renderMenuVariations
 */

import { render as renderListItem } from "./list-item.js";
import { render as renderVariationLink } from "./variation-link.js";
import helpers from "./helpers.js";

/**
 * Renders the variations of a component in the menu
 *
 * @param {boolean} isBuild - renders a build or not
 * @param {object} component - the component whose variations should be rendered
 * @param {object} request - the request object
 * @returns {string} the html with list items
 */
export const render = function (isBuild, component, request) {
  let html = "";

  for (const variation of component.variations) {
    const current = helpers.pathEqualsRequest(
      component.shortPath,
      variation,
      request
    );

    html += renderListItem(
      component.index,
      renderVariationLink(isBuild, component, variation, current),
      "variation"
    );
  }

  return html;
};
