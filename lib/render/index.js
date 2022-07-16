/**
 * Rendering module
 *
 * @module render
 */

const renderIframeComponent = require("./views/iframe/component");
const renderIframeDocs = require("./views/iframe/docs");
const renderIframeIndex = require("./views/iframe/index");
const renderIframeVariation = require("./views/iframe/variation");
const renderMainComponent = require("./views/main/component");
const renderMainDocs = require("./views/main/docs");
const renderMainIndex = require("./views/main/index");

module.exports = {
  renderMainIndex,
  renderMainComponent,
  renderMainDocs,
  renderIframeVariation,
  renderIframeComponent,
  renderIframeDocs,
  renderIframeIndex,
};
