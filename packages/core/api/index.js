const init = require("../lib");
const { getVariationData, resolveVariationData } = require("../lib/mocks");
const {
  getTemplateFilePathFromDirectoryPath,
} = require("../lib/render/helpers");

module.exports = function Api() {
  process.env.MIYAGI_JS_API = true;

  return new Promise((resolve) => {
    init("api").then((app) => {
      resolve({
        async getMockData({ component, variant = "default" }) {
          const file = getTemplateFilePathFromDirectoryPath(app, component);
          const variationData = await getVariationData(app, file, variant);

          return await resolveVariationData(app, variationData);
        },
      });
    });
  });
};
