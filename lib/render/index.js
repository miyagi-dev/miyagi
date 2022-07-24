/**
 * Rendering module
 *
 * @module render
 */

const renderIframeComponent = require("./views/iframe/component");
const renderIframeComponentDocs = require("./views/iframe/component.docs");
const renderIframeDocs = require("./views/iframe/docs");
const renderIframeIndex = require("./views/iframe/index");
const renderIframeVariation = require("./views/iframe/variation");
const renderMainComponent = require("./views/main/component");
const renderMainComponentDocs = require("./views/main/component.docs");
const renderMainDocs = require("./views/main/docs");
const renderMainIndex = require("./views/main/index");

module.exports = {
	renderMainIndex,
	renderMainComponent,
	renderMainComponentDocs,
	renderMainDocs,
	renderIframeVariation,
	renderIframeComponent,
	renderIframeComponentDocs,
	renderIframeDocs,
	renderIframeIndex,
};
