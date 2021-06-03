const resolveVariationData = require("./resolve");
const { extendTemplateData } = require("../render/helpers");
const helpers = require("../helpers");

module.exports = async function getVariationData(app, file, variation) {
  const fullFilePath = helpers.getFullPathFromShortPath(app, file);

  const componentJson = helpers.cloneDeep(
    app.get("state").fileContents[
      helpers.getDataPathFromTemplatePath(app, fullFilePath)
    ] || {}
  );
  const componentVariations = componentJson.$variants;
  let componentRootData = helpers.removeInternalKeys(componentJson);
  let componentData;

  if (componentVariations && variation) {
    let variationJson = componentVariations.find(
      (vari) => vari.$name === decodeURI(variation)
    );

    if (variationJson) {
      componentData = helpers.removeInternalKeys(variationJson);
    }
  }

  componentData = await resolveVariationData(
    app,
    componentData,
    componentRootData
  );

  return await extendTemplateData(app.get("config"), componentData, file);
};
