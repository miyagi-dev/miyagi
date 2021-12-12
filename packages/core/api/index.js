const init = require("../lib");
const { getVariationData, resolveVariationData } = require("../lib/mocks");
const renderIframeVariation = require("../lib/render/views/iframe/variation.js");
const {
  getTemplateFilePathFromDirectoryPath,
} = require("../lib/render/helpers");

module.exports = function Api() {
  process.env.MIYAGI_JS_API = true;

  return new Promise((resolve) => {
    init("api").then((app) => {
      const getMockData = async ({ component, variant = "default" }) => {
        const file = getTemplateFilePathFromDirectoryPath(app, component);
        const { extended: variationData } = await getVariationData(
          app,
          file,
          variant
        );

        return await resolveVariationData(app, variationData);
      };

      const getHtml = async ({ component, variant = "default" }) => {
        return await renderIframeVariation({
          app,
          file: component,
          variation: variant,
        });
      };

      const getNode = async ({ component, variant = "default" }) => {
        const html = await getHtml({
          component,
          variant,
        });

        return createElementFromHTML(html);
      };

      resolve({
        getMockData,
        getHtml,
        getNode,
      });
    });
  });
};

function createElementFromHTML(html) {
  const div = document.createElement("div");

  div.innerHTML = html.trim();

  if (div.childNodes.length > 1) {
    const container = document.createElement("div");

    div.childNodes.forEach((node) => {
      container.appendChild(node);
    });

    return container;
  }

  return div.firstChild;
}
