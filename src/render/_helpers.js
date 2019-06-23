const config = require("../config.json");
const fs = require("fs");
const path = require("path");

function getComponentErrorHtml(err) {
  return `<p class="RoundupError">${
    err === null ? config.messages.componentCouldNotBeRendered : err
  }</p>`;
}

function getJsonFromFile(req, fileName) {
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), `${req.app.get("config").srcFolder}/${fileName}`),
    "utf8"
  );

  return fileContent ? JSON.parse(fileContent) : {};
}

function overwriteDataWithDataFromFile(req, value) {
  let embeddedJson = getJsonFromFile(req, `${value.component}`);

  if (value.variation && embeddedJson.variations) {
    embeddedJson = embeddedJson.variations.filter(
      variation => variation.name === value.variation
    )[0];
  }

  return embeddedJson.data;
}

function mergeComponentDataWithVariation(req, componentData, variationData) {
  Object.entries(variationData).forEach(data => {
    const value = data[1];

    if (typeof value === "object" && value.component) {
      variationData[data[0]] = overwriteDataWithDataFromFile(req, value);
    }
  });

  return Object.assign({}, componentData, variationData);
}

function getAssetPath(req, component, type) {
  const assetPath = `${req.app.get("config").srcFolder}${component.slice(
    0,
    component.lastIndexOf(req.app.get("config").extension)
  )}${type}`;

  return fs.existsSync(assetPath) ? assetPath : null;
}

function resolveJsonURLs(req, data) {
  (function readJson(data) {
    Object.entries(data).forEach(entry => {
      const value = entry[1];

      if (
        typeof value === "string" &&
        value.lastIndexOf(`.${config.dataFileType}`) > 0 &&
        value.lastIndexOf(`.${config.dataFileType}`) === value.length - 5
      ) {
        const json = getJsonFromFile(req, value.replace(/\0/g, ""));

        if (json.data) {
          data[entry[0]] = json.data;

          readJson(data[entry[0]]);
        }
      }
    });
  })(data);

  return data;
}

function renderSingleComponent(req, res, component, context, cssFile, jsFile) {
  Object.entries(context).forEach(entry => {
    const value = entry[1];
    if (
      typeof value === "object" &&
      value.component &&
      value.component.lastIndexOf(`.${config.dataFileType}`) > 0 &&
      value.component.lastIndexOf(`.${config.dataFileType}`) ===
        value.component.length - 5
    ) {
      context[entry[0]] = overwriteDataWithDataFromFile(req, value);
    }
  });

  req.app.render(
    component,
    Object.assign({}, context, {
      partials: req.app.get("state").partials,
      basedir: path.join(process.cwd(), req.app.get("config").srcFolder) // for pug
    }),
    (err, result) => {
      res.render("component.hbs", {
        html: result || getComponentErrorHtml(err),
        cssFile,
        jsFile
      });
    }
  );
}

function renderVariations(req, res, component, data, json, cssFile, jsFile) {
  Object.entries(json.data).forEach(entry => {
    const value = entry[1];
    if (
      typeof value === "object" &&
      value.component &&
      value.component.lastIndexOf(`.${config.dataFileType}`) > 0 &&
      value.component.lastIndexOf(`.${config.dataFileType}`) ===
        value.component.length - 5
    ) {
      json.data[entry[0]] = overwriteDataWithDataFromFile(req, value);
    }
  });

  const variations = [];
  const splittedPath = component.split(path.sep);
  const fileName = splittedPath[splittedPath.length - 1];
  const context = [
    { component, data, name: fileName.slice(0, fileName.lastIndexOf(".")) }
  ];

  json.variations.forEach(variation => {
    context.push({
      component,
      data: mergeComponentDataWithVariation(req, json.data, variation.data),
      name: variation.name
    });
  });

  const promises = [];

  context.forEach((entry, i) => {
    promises.push(
      new Promise(resolve => {
        req.app.render(
          component,
          Object.assign({}, entry.data, {
            partials: req.app.get("state").partials,
            basedir: path.join(process.cwd(), req.app.get("config").srcFolder) // for pug
          }),
          (err, result) => {
            variations[i] = {
              file: context[i].component,
              html: result || getComponentErrorHtml(err),
              variation: context[i].name
                ? context[i].name
                : context[i].component
            };

            resolve(result);
          }
        );
      })
    );
  });

  Promise.all(promises).then(() => {
    res.render("component_variations.hbs", {
      variations,
      cssFile,
      jsFile
    });
  });
}

module.exports = {
  getAssetPath,
  getComponentErrorHtml,
  mergeComponentDataWithVariation,
  overwriteDataWithDataFromFile,
  renderSingleComponent,
  renderVariations,
  resolveJsonURLs
};
