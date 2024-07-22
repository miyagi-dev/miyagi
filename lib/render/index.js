/**
 * Rendering module
 * @module render
 */

import renderIframeComponent from "./views/iframe/component.js";
import renderIframeComponentDocs from "./views/iframe/component.docs.js";
import renderIframeDocs from "./views/iframe/docs.js";
import renderIframeIndex from "./views/iframe/index.js";
import renderIframeVariation from "./views/iframe/variation.js";
import renderMainComponent from "./views/main/component.js";
import renderMainComponentDocs from "./views/main/component.docs.js";
import renderMainDocs from "./views/main/docs.js";
import renderMainIndex from "./views/main/index.js";
import iframeDesignTokens from "./views/iframe/design-tokens/index.js";
import renderMainDesignTokens from "./views/main/design-tokens.js";

export default {
	renderMainIndex,
	renderMainComponent,
	renderMainComponentDocs,
	renderMainDocs,
	renderIframeVariation,
	renderIframeComponent,
	renderIframeComponentDocs,
	renderIframeDocs,
	renderIframeIndex,
	renderMainDesignTokens,
	iframe: {
		designTokens: {
			colors: iframeDesignTokens.colors,
			sizes: iframeDesignTokens.sizes,
			typography: iframeDesignTokens.typography,
		},
	},
};
