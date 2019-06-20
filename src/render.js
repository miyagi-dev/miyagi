const fs = require("fs");
const path = require("path");
const tests = require("./tests.json");

function getAsset(req, component, type) {
  const assetPath = `${req.app.get("config").srcFolder}${component.slice(
    0,
    component.lastIndexOf(req.app.get("config").extension)
  )}${type}`;

  return fs.existsSync(assetPath) ? assetPath : null;
}

function resolveJsonURLs(req, data) {
  (function readJson(data) {
    Object.entries(data).forEach(entry => {
      if (
        typeof entry[1] === "string" &&
        entry[1].indexOf(".json") >= 0 &&
        entry[1].indexOf(".json") === entry[1].length - 5
      ) {
        const file = fs.readFileSync(
          path.join(
            process.cwd(),
            `${req.app.get("config").srcFolder}/${entry[1].replace(/\0/g, "")}`
          ),
          "utf8"
        );

        if (file) {
          data[entry[0]] = JSON.parse(file).data;

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
    componentOverview: true,
    tests
  });
}

function renderMainWithComponent(req, res, component, variation) {
  let iframeSrc = `${req.protocol}://${
    req.headers.host
  }/?component=${component}`;
  let componentOverview = true;

  if (variation) {
    iframeSrc += `&variation=${variation}`;
    componentOverview = false;
  }

  res.render("index.hbs", {
    folders: req.app.get("state").srcStructure,
    iframeSrc,
    currentComponent: req.query.show,
    currentVariation: req.query.variation,
    componentOverview,
    tests
  });
}

function renderComponent(req, res, component, variation) {
  const variations = req.app.get("state").jsonData[component].variations;
  const componentData = req.app.get("state").jsonData[component].data;
  let context;

  const cssFile = getAsset(req, component, "css");
  const jsFile = getAsset(req, component, "js");

  if (variations) {
    const variationJson = variations.filter(
      vari => vari.name === decodeURI(variation)
    )[0];
    const variationData = variationJson
      ? resolveJsonURLs(req, variationJson.data)
      : {};

    context = Object.assign({}, componentData, variationData);
  } else {
    context = componentData;
  }

  req.app.render(component, context, (err, html) => {
    res.render("component.hbs", {
      html,
      cssFile,
      jsFile
    });
  });
}

function renderComponentVariations(req, res, component) {
  const variationsArr = [];
  const json = req.app.get("state").jsonData[component];
  const data = json.data ? resolveJsonURLs(req, json.data) : {};

  const cssFile = getAsset(req, component, "css");
  const jsFile = getAsset(req, component, "js");

  if (json.variations) {
    const splittedPath = component.split(path.sep);
    const fileName = splittedPath[splittedPath.length - 1];
    const context = [
      { component, data, name: fileName.slice(0, fileName.lastIndexOf(".")) }
    ];

    json.variations.forEach(entry => {
      context.push({
        component,
        data: Object.assign({}, json.data, entry.data),
        name: entry.name
      });
    });

    const promises = [];

    context.forEach((entry, i) => {
      promises.push(
        new Promise(resolve => {
          req.app.render(component, entry.data, (err, result) => {
            let html;

            if (result) {
              html = result;
            } else {
              html = `<p class="ComponentLibraryError">${err}</p>`;
            }

            variationsArr[i] = {
              file: context[i].component,
              html,
              variation: context[i].name
                ? context[i].name
                : context[i].component
            };

            resolve(result);
          });
        })
      );
    });

    Promise.all(promises).then(() => {
      res.render("component_variations.hbs", {
        variationsArr,
        cssFile,
        jsFile
      });
    });
  } else {
    req.app.render(component, data, (err, html) => {
      res.render("component.hbs", {
        html,
        cssFile,
        jsFile
      });
    });
  }
}

async function renderComponentOverview(req, res) {
  const componentsArr = [];
  const promises = [];

  const components = req.app
    .get("state")
    .filePaths.map(path => [path, req.app.get("state").jsonData[path].data]);

  const cssFiles = [];
  const jsFiles = [];

  components.forEach((component, i) => {
    cssFiles[i] = getAsset(req, component[0], "css");
    jsFiles[i] = getAsset(req, component[0], "js");

    promises.push(
      new Promise(resolve => {
        req.app.render(
          component[0],
          Object.assign({}, component[1]),
          (err, result) => {
            let html;

            if (result) {
              html = result;
            } else {
              html = `<p class="ComponentLibraryError">${err}</p>`;
            }

            componentsArr[i] = {
              file: components[i][0],
              html,
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
      componentsArr
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
