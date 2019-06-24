const path = require("path");
const tests = require("./_tests.json");
const config = require("../config.json");
const {
  getAssetPath,
  getComponentErrorHtml,
  mergeComponentDataWithVariation,
  overwriteDataWithDataFromFile,
  renderSingleComponent,
  renderVariations,
  resolveJsonURLs
} = require("./_helpers.js");

function renderMain(req, res) {
  res.render("index.hbs", {
    folders: req.app.get("state").srcStructure,
    iframeSrc: "?component=all",
    showAll: true,
    isComponentOverview: true,
    tests
  });
}

function renderMainWithComponent(req, res, component, variation) {
  let iframeSrc = `?component=${component}`;
  let isComponentOverview = true;

  if (variation) {
    iframeSrc += `&variation=${variation}`;
    isComponentOverview = false;
  }

  res.render("index.hbs", {
    folders: req.app.get("state").srcStructure,
    iframeSrc,
    requestedComponent: req.query.show,
    requestedVariation: req.query.variation,
    isComponentOverview,
    tests
  });
}

function renderComponent(req, res, component, variation) {
  const componentJson = req.app.get("state").jsonData[component];
  const variations = componentJson.variations;
  const componentData = componentJson.data;
  const cssFile =
    req.app.get("config").includeComponentCss &&
    getAssetPath(req, component, "css");
  const jsFile =
    req.app.get("config").includeComponentJs &&
    getAssetPath(req, component, "js");
  let context;

  if (variations) {
    const variationJson = variations.filter(
      vari => vari.name === decodeURI(variation)
    )[0];
    let variationData = variationJson
      ? resolveJsonURLs(req, variationJson.data)
      : {};

    context = mergeComponentDataWithVariation(
      req,
      componentData,
      variationData
    );
  } else {
    context = componentData;
  }

  renderSingleComponent(req, res, component, context, cssFile, jsFile);
}

function renderComponentVariations(req, res, component) {
  const json = req.app.get("state").jsonData[component];
  const data = json.data ? resolveJsonURLs(req, json.data) : {};
  const cssFile =
    req.app.get("config").includeComponentCss &&
    getAssetPath(req, component, "css");
  const jsFile =
    req.app.get("config").includeComponentJs &&
    getAssetPath(req, component, "js");

  if (json.variations) {
    renderVariations(req, res, component, data, json, cssFile, jsFile);
  } else {
    renderSingleComponent(req, res, component, data, cssFile, jsFile);
  }
}

async function renderComponentOverview(req, res) {
  const arr = [];
  const promises = [];
  const cssFiles = [];
  const jsFiles = [];
  const components = req.app
    .get("state")
    .filePaths.map(path => [path, req.app.get("state").jsonData[path].data]);

  components.forEach((component, i) => {
    const componentPath = component[0];
    const componentData = component[1];

    if (componentData) {
      Object.entries(componentData).forEach(entry => {
        const value = entry[1];
        if (
          typeof value === "object" &&
          value.component &&
          value.component.lastIndexOf(`.${config.dataFileType}`) > 0 &&
          value.component.lastIndexOf(`.${config.dataFileType}`) ===
            value.component.length - 5
        ) {
          componentData[entry[0]] = overwriteDataWithDataFromFile(req, value);
        }
      });
    }

    cssFiles[i] = getAssetPath(req, componentPath, "css");
    jsFiles[i] = getAssetPath(req, componentPath, "js");

    promises.push(
      new Promise(resolve => {
        req.app.render(
          componentPath,
          Object.assign({}, componentData, {
            partials: req.app.get("state").partials,
            basedir: path.join(process.cwd(), req.app.get("config").srcFolder), // for pug
            root: path.join(process.cwd(), req.app.get("config").srcFolder), // for ect
            settings: {
              views: path.join(process.cwd(), req.app.get("config").srcFolder) // for dust
            }
          }),
          (err, result) => {
            arr[i] = {
              file: components[i][0],
              html: result || getComponentErrorHtml(err),
              cssFile: cssFiles[i],
              jsFile: jsFiles[i]
            };

            resolve();
          }
        );
      })
    );
  });

  Promise.all(promises).then(() => {
    res.render("component_overview.hbs", {
      components: arr
    });
  });
}

module.exports = {
  renderMain,
  renderMainWithComponent,
  renderComponent,
  renderComponentVariations,
  renderComponentOverview
};
