"use strict";

const cloneDeep = require("clone-deep");
const path = require("path");
const tests = require("./tests.json");
const config = require("../config.json");
const helpers = require("../helpers.js");
const {
  getComponentErrorHtml,
  getDataForRenderFunction,
  getFallbackData,
  mergeRootDataWithVariationData,
  mergeWithGlobalData,
  overwriteJsonLinksWithJsonData
} = require("./_helpers.js");

async function renderMain(req, res) {
  await res.render("index.hbs", {
    folders: req.app.get("state").menu,
    iframeSrc: "/component?file=all&embedded=true",
    showAll: true,
    isComponentOverview: true,
    tests,
    projectName: config.projectName,
    userProjectName: req.app.get("config").projectName
  });
}

async function renderMainWithComponent(req, res, component, variation) {
  let iframeSrc = `/component?file=${component}`;
  let isComponentOverview = true;

  if (variation) {
    iframeSrc += `&variation=${variation}`;
    isComponentOverview = false;
  }

  iframeSrc += "&embedded=true";

  await res.render("index.hbs", {
    folders: req.app.get("state").menu,
    iframeSrc,
    requestedComponent: component,
    requestedVariation: variation,
    isComponentOverview,
    tests,
    projectName: config.projectName,
    userProjectName: req.app.get("config").projectName
  });
}

async function renderMainWith404(req, res, component, variation) {
  let iframeSrc = `/component?file=${component}`;

  if (variation) {
    iframeSrc += `&variation=${variation}`;
  }

  iframeSrc += "&embedded=true";

  await res.render("index.hbs", {
    folders: req.app.get("state").menu,
    iframeSrc,
    requestedComponent: null,
    requestedVariation: null,
    isComponentOverview: false,
    projectName: config.projectName,
    userProjectName: req.app.get("config").projectName,
    htmlValidation: false,
    accessibilityValidation: false
  });
}

async function renderComponent(req, res, component, variation, embedded) {
  const componentJson = cloneDeep(
    req.app.get("state").data[
      helpers.getFullPathFromShortPath(
        req.app,
        helpers.getDataPathFromTemplatePath(req.app, component)
      )
    ] || {}
  );
  const componentVariations = componentJson.variations;
  let componentData = componentJson.data;

  if (componentVariations && variation) {
    const variationJson = componentVariations.find(
      vari => vari.name === decodeURI(variation)
    );

    if (variationJson) {
      componentData = mergeRootDataWithVariationData(
        componentData,
        variationJson.data ? variationJson.data : {}
      );
    }
  }

  componentData = mergeWithGlobalData(
    req.app,
    await overwriteJsonLinksWithJsonData(req, componentData)
  );

  await renderSingleComponent(
    req,
    res,
    component,
    componentData,
    embedded ? `/component?file=${component}&variation=${variation}` : null
  );
}

async function renderComponentVariations(req, res, componentPath, embedded) {
  const componentJson = cloneDeep(
    req.app.get("state").data[
      helpers.getFullPathFromShortPath(
        req.app,
        helpers.getDataPathFromTemplatePath(req.app, componentPath)
      )
    ] || {}
  );
  const componentVariations = componentJson.variations;
  const splittedPath = componentPath.split(path.sep);
  const fileName = splittedPath[splittedPath.length - 1];
  const standaloneUrl = embedded ? `/component?file=${componentPath}` : null;
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

    await Promise.all(
      context.map(async (entry, i) => {
        return new Promise(async resolve => {
          context[i].data = mergeWithGlobalData(
            req.app,
            await overwriteJsonLinksWithJsonData(req, entry.data)
          );
          resolve();
        });
      })
    ).then(async () => {
      return await renderVariations(
        req,
        res,
        componentPath,
        context,
        standaloneUrl
      );
    });
  } else {
    await renderSingleComponent(
      req,
      res,
      componentPath,
      mergeWithGlobalData(
        req.app,
        await overwriteJsonLinksWithJsonData(req, componentData)
      ),
      standaloneUrl
    );
  }
}

async function renderComponentOverview(req, res, embedded) {
  const arr = [];
  const promises = [];

  const components = Object.keys(req.app.get("state").partials).map(path => {
    let componentJson =
      req.app.get("state").data[
        helpers.getFullPathFromShortPath(
          req.app,
          helpers.getDataPathFromTemplatePath(req.app, path)
        )
      ] || {};
    let componentData;

    if (componentJson.data) {
      componentData = componentJson.data;
    } else if (componentJson.variations && componentJson.variations.length) {
      componentData = getFallbackData(componentJson.variations);
    }

    return [path, cloneDeep(componentData)];
  });

  components.forEach((component, i) => {
    promises.push(
      new Promise(async resolve => {
        const [componentPath] = component;
        let [, componentData] = component;

        if (componentData) {
          componentData = mergeWithGlobalData(
            req.app,
            await overwriteJsonLinksWithJsonData(req, componentData)
          );
        }

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

  await Promise.all(promises).then(async () => {
    await res.render("component_overview.hbs", {
      components: arr,
      standaloneUrl: embedded ? "/component?file=all" : null,
      dev: process.env.NODE_ENV === "development",
      prod: process.env.NODE_ENV === "production",
      a11yTestsPreload: req.app.get("config").validations.accessibility,
      projectName: config.projectName,
      userProjectName: req.app.get("config").projectName
    });
  });
}

async function renderSingleComponent(
  req,
  res,
  component,
  context,
  standaloneUrl
) {
  return new Promise(async resolve => {
    req.app.render(
      component,
      getDataForRenderFunction(req, context),
      async (err, result) => {
        await res.render(
          standaloneUrl ? "component_frame.hbs" : "component.hbs",
          {
            html: result || getComponentErrorHtml(err),
            htmlValidation: req.app.get("config").validations.html,
            accessibilityValidation: req.app.get("config").validations
              .accessibility,
            standaloneUrl,
            dev: process.env.NODE_ENV === "development",
            prod: process.env.NODE_ENV === "production",
            projectName: config.projectName,
            userProjectName: req.app.get("config").projectName
          }
        );

        resolve();
      }
    );
  });
}

async function renderVariations(req, res, component, data, standaloneUrl) {
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
              variation: data[i].name
                ? data[i].name
                : data[i].component.replace(
                    `.${req.app.get("config").extension}`,
                    ""
                  )
            };

            resolve(result);
          }
        );
      })
    );
  });

  await Promise.all(promises).then(async () => {
    await res.render("component_variations.hbs", {
      variations,
      standaloneUrl,
      dev: process.env.NODE_ENV === "development",
      prod: process.env.NODE_ENV === "production",
      a11yTestsPreload: req.app.get("config").validations.accessibility,
      projectName: config.projectName,
      userProjectName: req.app.get("config").projectName
    });
  });
}

async function renderComponentNotFound(req, res, embedded, target) {
  await res.render(embedded ? "component_frame.hbs" : "component.hbs", {
    html: `<p class="HeadmanError">${target} not found.</p>`,
    standaloneUrl: null,
    dev: process.env.NODE_ENV === "development",
    prod: process.env.NODE_ENV === "production",
    projectName: config.projectName,
    userProjectName: req.app.get("config").projectName,
    htmlValidation: false,
    accessibilityValidation: false
  });
}

module.exports = {
  renderMain,
  renderMainWithComponent,
  renderMainWith404,
  renderComponent,
  renderComponentVariations,
  renderComponentOverview,
  renderComponentNotFound
};
