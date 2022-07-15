const { JSDOM } = require("jsdom");
const init = require("../lib");
const { getVariationData, resolveVariationData } = require("../lib/mocks");
const renderIframeVariation = require("../lib/render/views/iframe/variation.js");
const { getTemplateFilePathFromDirectoryPath } = require("../lib/helpers");
const build = require("../lib/build");
const mocks = require("../lib/generator/mocks");

module.exports = function Api() {
  process.env.MIYAGI_JS_API = true;

  const getMockData = async ({ component, variant = "default" }) => {
    const app = await init("api");
    const file = getTemplateFilePathFromDirectoryPath(app, component);
    const { extended: variationData } = await getVariationData(
      app,
      file,
      variant
    );

    const result = await resolveVariationData(app, variationData);

    return result.resolved;
  };

  const getHtml = async ({ component, variant = "default" }) => {
    const app = await init("api");

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

  const createBuild = async () => {
    const app = await init("build");

    return build(app);
  };

  const createMockData = async ({ component }) => {
    const app = await init("api");

    return mocks(component, app.get("config").files);
  };

  return {
    getMockData,
    getHtml,
    getNode,
    createBuild,
    createMockData,
  };
};

function createElementFromHTML(html) {
  const { document } = new JSDOM().window;
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
