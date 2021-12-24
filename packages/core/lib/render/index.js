/**
 * Rendering module
 *
 * @module render
 */

import renderIframe404 from "./views/iframe/404.js";
import renderIframeComponent from "./views/iframe/component.js";
import renderIframeIndex from "./views/iframe/index.js";
import renderIframeVariation from "./views/iframe/variation.js";
import renderMain404 from "./views/main/404.js";
import renderMainComponent from "./views/main/component.js";
import renderMainIndex from "./views/main/index.js";

export default {
  renderMainIndex,
  renderMainComponent,
  renderMain404,
  renderIframeVariation,
  renderIframeComponent,
  renderIframeIndex,
  renderIframe404,
};
