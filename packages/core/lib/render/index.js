/**
 * Rendering module
 *
 * @module render
 */

const renderIframe404 = require("./views/iframe/404");
const renderIframeComponent = require("./views/iframe/component");
const renderIframeIndex = require("./views/iframe/index");
const renderIframeVariation = require("./views/iframe/variation");
const renderMain404 = require("./views/main/404");
const renderMainComponent = require("./views/main/component");
const renderMainIndex = require("./views/main/index");

module.exports = {
  renderMainIndex,
  renderMainComponent,
  renderMain404,
  renderIframeVariation,
  renderIframeComponent,
  renderIframeIndex,
  renderIframe404,
};
