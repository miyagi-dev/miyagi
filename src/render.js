const config = require("./config.json");
const fs = require("fs");
const path = require("path");
const tests = require("./tests.json");

function getComponentErrorHtml(err) {
  return `<p class="ComponentLibraryError">${err}</p>`;
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

function renderMain(req, res) {
  res.render("index.hbs", {
    folders: req.app.get("state").srcStructure,
    iframeSrc: `${req.protocol}://${req.headers.host}/?component=all`,
    showAll: true,
    isComponentOverview: true,
    tests
  });
}

function renderMainWithComponent(req, res, component, variation) {
  let iframeSrc = `${req.protocol}://${
    req.headers.host
  }/?component=${component}`;
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

function renderSingleComponent(req, res, component, context, cssFile, jsFile) {
  req.app.render(component, context, (err, result) => {
    res.render("component.hbs", {
      html: result || getComponentErrorHtml(err),
      cssFile,
      jsFile
    });
  });
}

function renderComponent(req, res, component, variation) {
  const componentJson = req.app.get("state").jsonData[component];
  const variations = componentJson.variations;
  const componentData = componentJson.data;
  const cssFile = getAssetPath(req, component, "css");
  const jsFile = getAssetPath(req, component, "js");
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

function renderVariations(req, res, component, data, json, cssFile, jsFile) {
  const variations = [];
  const splittedPath = component.split(path.sep);
  const fileName = splittedPath[splittedPath.length - 1];
  const context = [
    { component, data, name: fileName.slice(0, fileName.lastIndexOf(".")) }
  ];

  json.variations.forEach(entry => {
    context.push({
      component,
      data: mergeComponentDataWithVariation(req, json.data, entry.data),
      name: entry.name
    });
  });

  const promises = [];

  context.forEach((entry, i) => {
    promises.push(
      new Promise(resolve => {
        req.app.render(component, entry.data, (err, result) => {
          variations[i] = {
            file: context[i].component,
            html: result || getComponentErrorHtml(err),
            variation: context[i].name ? context[i].name : context[i].component
          };

          resolve(result);
        });
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

function renderComponentVariations(req, res, component) {
  const json = req.app.get("state").jsonData[component];
  const data = json.data ? resolveJsonURLs(req, json.data) : {};
  const cssFile = getAssetPath(req, component, "css");
  const jsFile = getAssetPath(req, component, "js");

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
    const componentData = Object.assign({}, component[1]);

    cssFiles[i] = getAssetPath(req, componentPath, "css");
    jsFiles[i] = getAssetPath(req, componentPath, "js");

    promises.push(
      new Promise(resolve => {
        req.app.render(componentPath, componentData, (err, result) => {
          arr[i] = {
            file: components[i][0],
            html: result || getComponentErrorHtml(err),
            cssFile: cssFiles[i],
            jsFile: jsFiles[i]
          };

          resolve();
        });
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
