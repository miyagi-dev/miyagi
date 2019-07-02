const cloneDeep = require("clone-deep");
const path = require("path");
const tests = require("./tests.json");
const config = require("../config.json");
const {
  getComponentErrorHtml,
  getDataForRenderFunction,
  mergeRootDataWithVariationData,
  overwriteJsonLinksWithJsonData
} = require("./helpers.js");

function renderMain(req, res) {
  res.render("index.hbs", {
    folders: req.app.get("state").menu,
    iframeSrc: "?component=all&embedded=true",
    showAll: true,
    isComponentOverview: true,
    tests,
    projectName: config.projectName,
    userProjectName: req.app.get("config").projectName
  });
}

function renderMainWithComponent(req, res, component, variation) {
  let iframeSrc = `?component=${component}`;
  let isComponentOverview = true;

  if (variation) {
    iframeSrc += `&variation=${variation}`;
    isComponentOverview = false;
  }

  iframeSrc += "&embedded=true";

  res.render("index.hbs", {
    folders: req.app.get("state").menu,
    iframeSrc,
    requestedComponent: req.query.show,
    requestedVariation: req.query.variation,
    isComponentOverview,
    tests,
    projectName: config.projectName,
    userProjectName: req.app.get("config").projectName
  });
}

function renderComponent(req, res, component, variation, embedded) {
  const componentJson = cloneDeep(req.app.get("state").data[component]);
  const componentVariations = componentJson.variations;
  let componentData = componentJson.data;

  if (componentVariations && variation) {
    const variationJson = componentVariations.filter(
      vari => vari.name === decodeURI(variation)
    )[0];

    if (variationJson) {
      componentData = mergeRootDataWithVariationData(
        componentData,
        variationJson.data ? variationJson.data : {}
      );
    }
  }

  componentData = overwriteJsonLinksWithJsonData(req, componentData);

  renderSingleComponent(
    req,
    res,
    component,
    componentData,
    embedded
      ? `?component=${req.query.component}&variation=${req.query.variation}`
      : null
  );
}

function renderComponentVariations(req, res, componentPath, embedded) {
  const componentJson = cloneDeep(req.app.get("state").data[componentPath]);
  const componentVariations = componentJson.variations;
  const splittedPath = componentPath.split(path.sep);
  const fileName = splittedPath[splittedPath.length - 1];
  const standaloneUrl = embedded ? `?component=${req.query.component}` : null;
  const context = [];
  let componentData = componentJson.data;

  if (componentData) {
    context.push({
      component: componentPath,
      data: componentData,
      name: fileName.slice(0, fileName.lastIndexOf("."))
    });
  }

  if (componentVariations) {
    componentVariations.forEach(variationJson => {
      context.push({
        component: componentPath,
        data: componentData
          ? mergeRootDataWithVariationData(
              componentData,
              variationJson.data ? variationJson.data : {}
            )
          : variationJson.data
          ? variationJson.data
          : {},
        name: variationJson.name
      });
    });

    context.forEach((entry, i) => {
      context[i].data = overwriteJsonLinksWithJsonData(req, entry.data);
    });

    renderVariations(req, res, componentPath, context, standaloneUrl);
  } else {
    renderSingleComponent(
      req,
      res,
      componentPath,
      overwriteJsonLinksWithJsonData(req, componentData),
      standaloneUrl
    );
  }
}

function getFallbackData(variations) {
  for (let i = 0; i < variations.length; i += 1) {
    if (variations[i].data) {
      return variations[i].data;
    }
  }

  return {};
}

async function renderComponentOverview(req, res, embedded) {
  const arr = [];
  const promises = [];

  const components = Object.keys(req.app.get("state").partials).map(path => {
    let componentJson = req.app.get("state").data[path];
    let componentData;

    if (componentJson) {
      if (componentJson.data) {
        componentData = componentJson.data;
      } else if (componentJson.variations && componentJson.variations.length) {
        componentData = getFallbackData(componentJson.variations);
      }
    } else {
      componentData = {};
    }

    return [path, cloneDeep(componentData)];
  });

  components.forEach((component, i) => {
    const componentPath = component[0];
    let componentData = component[1];

    if (componentData) {
      componentData = overwriteJsonLinksWithJsonData(req, componentData);
    }

    promises.push(
      new Promise(resolve => {
        req.app.render(
          componentPath,
          getDataForRenderFunction(req, componentData),
          (err, result) => {
            arr[i] = {
              file: components[i][0],
              html: result || getComponentErrorHtml(err)
            };

            resolve();
          }
        );
      })
    );
  });

  Promise.all(promises).then(() => {
    res.render("component_overview.hbs", {
      components: arr,
      standaloneUrl: embedded ? "?component=all" : null,
      dev: process.env.NODE_ENV !== "production",
      prod: process.env.NODE_ENV === "production",
      a11yTestsPreload: req.app.get("config").validations.accessibility,
      projectName: config.projectName,
      userProjectName: req.app.get("config").projectName
    });
  });
}

function renderSingleComponent(req, res, component, context, standaloneUrl) {
  req.app.render(
    component,
    getDataForRenderFunction(req, context),
    (err, result) => {
      res.render(standaloneUrl ? "component_frame.hbs" : "component.hbs", {
        html: result || getComponentErrorHtml(err),
        htmlValidation: req.app.get("config").validations.html,
        accessibilityValidation: req.app.get("config").validations
          .accessibility,
        standaloneUrl,
        dev: process.env.NODE_ENV !== "production",
        prod: process.env.NODE_ENV === "production",
        a11yTests: req.app.get("config").validations.accessibility,
        projectName: config.projectName,
        userProjectName: req.app.get("config").projectName
      });
    }
  );
}

function renderVariations(req, res, component, data, standaloneUrl) {
  const variations = [];
  const promises = [];

  data.forEach((entry, i) => {
    promises.push(
      new Promise(resolve => {
        req.app.render(
          component,
          getDataForRenderFunction(req, entry.data),
          (err, result) => {
            variations[i] = {
              file: data[i].component,
              html: result || getComponentErrorHtml(err),
              variation: data[i].name ? data[i].name : data[i].component
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
      standaloneUrl,
      dev: process.env.NODE_ENV !== "production",
      prod: process.env.NODE_ENV === "production",
      a11yTestsPreload: req.app.get("config").validations.accessibility,
      projectName: config.projectName,
      userProjectName: req.app.get("config").projectName
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
