const fs = require("fs");
const path = require("path");
const tests = require("./tests.json");

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
    res.render("component.hbs", { html });
  });
}

function renderComponentVariations(req, res, component) {
  const json = req.app.get("state").jsonData[component];
  const data = json.data ? resolveJsonURLs(req, json.data) : {};

  if (json.variations) {
    const context = [{ component, data }];

    json.variations.forEach(entry => {
      context.push({
        component,
        data: Object.assign({}, json.data, entry.data)
      });
    });

    const html = [];
    const promises = [];

    context.forEach((entry, i) => {
      promises.push(
        new Promise(resolve => {
          req.app.render(component, entry.data, (err, result) => {
            html[i] = result;
            resolve(result);
          });
        })
      );
    });

    Promise.all(promises).then(() => {
      res.render("component_variations.hbs", {
        html
      });
    });
  } else {
    req.app.render(component, data, (err, html) => {
      res.render("component.hbs", { html });
    });
  }
}

async function renderComponentOverview(req, res) {
  const html = [];
  const promises = [];

  const components = req.app
    .get("state")
    .filePaths.map(path => [path, req.app.get("state").jsonData[path].data]);

  components.forEach((component, i) => {
    promises.push(
      new Promise(resolve => {
        req.app.render(
          component[0],
          Object.assign({}, component[1]),
          (err, result) => {
            html[i] = result;
            resolve();
          }
        );
      })
    );
  });

  Promise.all(promises).then(() => {
    res.render("component_overview.hbs", {
      html
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
