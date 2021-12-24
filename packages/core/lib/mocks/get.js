import resolveData from "./resolve.js";
import config from "../miyagi-config.js";
import { extendTemplateData } from "../render/helpers.js";
import {
  cloneDeep,
  getDataPathFromTemplatePath,
  getFullPathFromShortPath,
  normalizeString,
  removeInternalKeys,
} from "../helpers.js";

export const getComponentData = async function getComponentData(app, file) {
  const templateFilePath = getFullPathFromShortPath(app, file);
  const componentJson = cloneDeep(
    app.get("state").fileContents[
      getDataPathFromTemplatePath(app, templateFilePath)
    ]
  );
  const hasTemplate = Object.values(app.get("state").partials).includes(
    templateFilePath
  );

  let context = [];

  if (componentJson) {
    let componentData = removeInternalKeys(componentJson);
    const rootData = cloneDeep(componentData);
    const componentVariations = componentJson.$variants;
    let data;

    if (Object.keys(componentData).length > 0) {
      data = await resolveData(app, componentData);
    } else {
      data = {
        merged: componentData,
        resolved: componentData,
      };
    }

    if (componentVariations) {
      const promises = [];
      let startIndex = context.length;
      for (const [index, variationJson] of componentVariations.entries()) {
        if (variationJson.$name) {
          promises.push(
            new Promise((resolve) => {
              const variationData = removeInternalKeys(variationJson);

              resolveData(app, variationData, rootData).then(
                async ({ merged, resolved }) => {
                  const extendedData = hasTemplate
                    ? await extendTemplateData(
                        app.get("config"),
                        resolved,
                        file
                      )
                    : {};

                  context[startIndex + index] = {
                    component: file,
                    data: extendedData,
                    rawData: merged,
                    name: variationJson.$name,
                  };
                  resolve();
                }
              );
            })
          );
        }
      }

      return await Promise.all(promises).then(async () => {
        if (Object.keys(data.resolved).length > 0) {
          const extendedComponentData = await extendTemplateData(
            app.get("config"),
            data.resolved,
            file
          );

          if (!componentJson.$hidden) {
            context.unshift({
              component: file,
              data: extendedComponentData,
              rawData: data.merged,
              name: componentJson.$name || config.defaultVariationName,
            });
          }
        }

        return context.filter((entry) => entry !== null);
      });
    } else {
      if (Object.keys(componentData).length > 0) {
        const { merged, resolved } = await resolveData(app, componentData);
        const extendedComponentData = await extendTemplateData(
          app.get("config"),
          resolved,
          file
        );

        if (!componentJson.$hidden) {
          context.unshift({
            component: file,
            data: extendedComponentData,
            rawData: merged,
            name: componentJson.$name || config.defaultVariationName,
          });
        }
      }

      return context;
    }
  }

  return context;
};

export const getVariationData = async function getVariationData(
  app,
  file,
  variation
) {
  const fullFilePath = getFullPathFromShortPath(app, file);
  const componentJson = cloneDeep(
    app.get("state").fileContents[
      getDataPathFromTemplatePath(app, fullFilePath)
    ] || {}
  );
  const componentVariations = componentJson.$variants;
  let componentRootData = removeInternalKeys(componentJson);
  let componentData;

  if (componentJson.$hidden) {
    if (!variation) {
      return {
        raw: null,
        extended: null,
      };
    }

    if (variation === "default") {
      if (componentVariations) {
        const componentVariationsIncludesDefault = Boolean(
          componentVariations.find((variant) => variant.$name === "default")
        );

        if (!componentVariationsIncludesDefault) {
          return {
            raw: null,
            extended: null,
          };
        }
      }
    }
  }

  if (componentVariations && variation) {
    let variationJson = componentVariations.find((vari) => {
      return normalizeString(vari.$name) === normalizeString(variation);
    });

    if (variationJson) {
      componentData = removeInternalKeys(variationJson);
    }
  }

  const { merged, resolved } = await resolveData(
    app,
    componentData,
    componentRootData
  );
  return {
    raw: merged,
    extended: await extendTemplateData(app.get("config"), resolved, file),
  };
};
