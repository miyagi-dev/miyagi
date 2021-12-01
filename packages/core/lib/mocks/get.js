const resolveData = require("./resolve");
const config = require("../config.json");
const { cloneDeep } = require("../helpers");
const { extendTemplateData } = require("../render/helpers");
const helpers = require("../helpers");

module.exports = {
  getComponentData: async function getComponentData(app, file) {
    const templateFilePath = helpers.getFullPathFromShortPath(app, file);
    const componentJson = helpers.cloneDeep(
      app.get("state").fileContents[
        helpers.getDataPathFromTemplatePath(app, templateFilePath)
      ]
    );
    const hasTemplate = Object.values(app.get("state").partials).includes(
      templateFilePath
    );

    let context = [];

    if (componentJson) {
      let componentData = helpers.removeInternalKeys(componentJson);
      const rootData = cloneDeep(componentData);
      const componentVariations = componentJson.$variants;

      if (Object.keys(componentData).length > 0) {
        componentData = await resolveData(app, componentData);
      }

      if (componentVariations) {
        const promises = [];
        let startIndex = context.length;
        for (const [index, variationJson] of componentVariations.entries()) {
          if (variationJson.$name) {
            promises.push(
              new Promise((resolve) => {
                const variationData = helpers.removeInternalKeys(variationJson);

                resolveData(app, variationData, rootData).then(async (data) => {
                  data = hasTemplate
                    ? await extendTemplateData(app.get("config"), data, file)
                    : {};

                  context[startIndex + index] = {
                    component: file,
                    data: data || {},
                    name: variationJson.$name,
                  };
                  resolve();
                });
              })
            );
          }
        }

        return await Promise.all(promises).then(async () => {
          if (Object.keys(componentData).length > 0) {
            componentData = await extendTemplateData(
              app.get("config"),
              componentData,
              file
            );

            if (!componentJson.$hidden) {
              context.unshift({
                component: file,
                data: componentData,
                name: componentJson.$name || config.defaultVariationName,
              });
            }
          }

          return context.filter((entry) => entry !== null);
        });
      } else {
        if (Object.keys(componentData).length > 0) {
          componentData = await resolveData(app, componentData);
          componentData = await extendTemplateData(
            app.get("config"),
            componentData,
            file
          );

          if (!componentJson.$hidden) {
            context.unshift({
              component: file,
              data: componentData,
              name: componentJson.$name || config.defaultVariationName,
            });
          }
        }

        return context;
      }
    }

    return context;
  },

  getVariationData: async function getVariationData(app, file, variation) {
    const fullFilePath = helpers.getFullPathFromShortPath(app, file);
    const componentJson = helpers.cloneDeep(
      app.get("state").fileContents[
        helpers.getDataPathFromTemplatePath(app, fullFilePath)
      ] || {}
    );
    const componentVariations = componentJson.$variants;
    let componentRootData = helpers.removeInternalKeys(componentJson);
    let componentData;

    if ((!variation || variation === "default") && componentJson.$hidden) {
      return null;
    }

    if (componentVariations && variation) {
      let variationJson = componentVariations.find((vari) => {
        return (
          helpers.normalizeString(vari.$name) ===
          helpers.normalizeString(variation)
        );
      });

      if (variationJson) {
        componentData = helpers.removeInternalKeys(variationJson);
      }
    }

    componentData = await resolveData(app, componentData, componentRootData);
    return await extendTemplateData(app.get("config"), componentData, file);
  },
};
