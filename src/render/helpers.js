const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const deepMerge = require("deepmerge");
const cloneDeep = require("clone-deep");

function getComponentErrorHtml(err) {
  return `<p class="RoundupError">${
    err === null ? config.messages.componentCouldNotBeRendered : err
  }</p>`;
}

function getJsonFromFile(req, fileName) {
  let fileContent;

  try {
    fileContent = fs.readFileSync(
      path.join(
        process.cwd(),
        `${req.app.get("config").srcFolder}/${fileName}`
      ),
      "utf8"
    );

    try {
      fileContent = fileContent ? JSON.parse(fileContent) : {};
    } catch (e) {
      fileContent = {};
    }
  } catch (e) {
    fileContent = {};
  }

  return fileContent;
}

function resolveJson(req, value) {
  const val = value.component || value;

  let embeddedJson = getJsonFromFile(req, `${val.replace(/\0/g, "")}`);

  if (
    value.variation &&
    embeddedJson.variations &&
    embeddedJson.variations.length
  ) {
    const variant = embeddedJson.variations.filter(
      variation => variation.name === value.variation
    )[0];
    return variant && variant.data ? variant.data : {};
  } else {
    return embeddedJson.data;
  }
}

function valueIsJsonLink(value) {
  if (typeof value !== "string") return false;

  return (
    value.lastIndexOf(`.${config.dataFileType}`) > 0 &&
    value.lastIndexOf(`.${config.dataFileType}`) === value.length - 5
  );
}

function overwriteJsonLinksWithJsonData(req, data) {
  (function readJson(data) {
    if (!data) return {};

    Object.entries(data).forEach(entry => {
      let value = entry[1];

      if (value instanceof Array) {
        readJson(value);
      } else if (typeof value === "string") {
        if (valueIsJsonLink(value)) {
          data[entry[0]] = resolveJson(req, value);
          readJson(data[entry[0]]);
        } else {
          data[entry[0]] = value;
        }
      } else if (value !== null && typeof value === "object") {
        if (value.component) {
          if (valueIsJsonLink(value.component)) {
            let dataWithoutComponentAndVariation = cloneDeep(value);
            let resolvedJson = resolveJson(req, {
              component: value.component,
              variation: value.variation
            });

            delete dataWithoutComponentAndVariation.component;
            delete dataWithoutComponentAndVariation.variation;

            data[entry[0]] = deepMerge(resolvedJson, value);

            readJson(data[entry[0]]);
          } else {
            data[entry[0]] = value;
          }
        } else {
          Object.entries(value).forEach(val => {
            if (valueIsJsonLink(val[1])) {
              data[entry[0][val[0]]] = resolveJson(req, val[1]);
              readJson(data[entry[0][val[0]]]);
            } else {
              data[entry[0][val[0]]] = val[1];
            }
          });
        }
      }
    });

    return data;
  })(data);

  return data;
}

function mergeRootDataWithVariationData(rootData, variationData) {
  if (!rootData) {
    return variationData;
  }

  if (!variationData) {
    return rootData;
  }

  return deepMerge(rootData, variationData);
}

function getAssetPath(req, component, type) {
  const assetPath = `${req.app.get("config").srcFolder}${component.slice(
    0,
    component.lastIndexOf(req.app.get("config").extension)
  )}${type}`;

  return fs.existsSync(assetPath) ? assetPath : null;
}

function getDataForRenderFunction(req, data) {
  return Object.assign({}, data, {
    partials: req.app.get("state").partials,
    basedir: path.join(process.cwd(), req.app.get("config").srcFolder), // for pug
    root: path.join(process.cwd(), req.app.get("config").srcFolder), // for ect
    settings: {
      views: path.join(process.cwd(), req.app.get("config").srcFolder) // for dust
    }
  });
}

module.exports = {
  getAssetPath,
  getComponentErrorHtml,
  getDataForRenderFunction,
  mergeRootDataWithVariationData,
  overwriteJsonLinksWithJsonData
};
