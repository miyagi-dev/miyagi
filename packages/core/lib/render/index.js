/**
 * Rendering module
 *
 * @module render
 */

const renderIframeComponent = require("./views/iframe/component");
const renderIframeIndex = require("./views/iframe/index");
const renderIframeVariation = require("./views/iframe/variation");
const renderMainComponent = require("./views/main/component");
const renderMainIndex = require("./views/main/index");

module.exports = {
  renderMainIndex,
  renderMainComponent,
  renderIframeVariation,
  renderIframeComponent,
  renderIframeIndex,
};
