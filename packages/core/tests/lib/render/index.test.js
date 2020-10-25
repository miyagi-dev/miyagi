const express = require("express");
const engines = require("consolidate");
const path = require("path");
const deepMerge = require("deepmerge");
const config = require("../../../lib/config.json");
const tests = require("../../../lib/render/tests.json");
const render = require("../../../lib/render");

jest.mock("../../../lib/logger");

const component = "component1/index.hbs";
const variation = "variation";
const menu = "menu";
const userProjectName = "projectName";
const path1 = path.join(
  process.cwd(),
  "/tests/mocks/srcFolder/component1/index.hbs"
);
const path2 = path.join(
  process.cwd(),
  "/tests/mocks/srcFolder/component2/index.hbs"
);
const path3 = path.join(
  process.cwd(),
  "/tests/mocks/srcFolder/component3/index.hbs"
);
const path4 = path.join(
  process.cwd(),
  "/tests/mocks/srcFolder/component4/index.hbs"
);
const path6 = path.join(
  process.cwd(),
  "/tests/mocks/srcFolder/component6/index.hbs"
);
const path7 = path.join(
  process.cwd(),
  "/tests/mocks/srcFolder/component7/index.hbs"
);
const path8 = path.join(
  process.cwd(),
  "/tests/mocks/srcFolder/component8/index.hbs"
);
const path9 = path.join(
  process.cwd(),
  "/tests/mocks/srcFolder/component9/index.hbs"
);
const fileContents = {};

/**
 *
 */
function addGlobalData() {
  app.get("state").fileContents[
    path.join(process.cwd(), "/tests/mocks/srcFolder/data.json")
  ] = {
    global: "global",
  };
}

fileContents[path1.replace("index.hbs", "mocks.json")] = {
  component: "component1",
  $variants: [
    { $name: "variation1", variation: 1 },
    { $name: "variation2", variation: 2 },
  ],
};
fileContents[path2.replace("index.hbs", "mocks.json")] = {
  component: "component2",
};
fileContents[path3.replace("index.hbs", "mocks.json")] = {
  $variants: [
    { $name: "variation1", variation: 1 },
    { $name: "variation2", variation: 2 },
  ],
};
fileContents[path6.replace("index.hbs", "mocks.json")] = {
  $variants: [
    {
      $name: "variation1",
    },
  ],
};
fileContents[path7.replace("index.hbs", "mocks.json")] = {
  $variants: [{}, { $name: "foo" }],
};
fileContents[path8.replace("index.hbs", "mocks.json")] = {
  $variants: [
    {
      $name: "variation1",
    },
  ],
};
fileContents[path9.replace("index.hbs", "mocks.json")] = {
  some: "data",
  $variants: [
    {
      $name: "variation1",
    },
  ],
};
const { projectName } = config;
const folders = menu;

let app;
let res;

beforeEach(() => {
  app = express();

  app.engine("hbs", engines.handlebars);
  app.set("view engine", "hbs");

  app.set("state", {
    menu,
    partials: {
      "component1/index.hbs": path1,
      "component2/index.hbs": path2,
      "component3/index.hbs": path3,
      "component4/index.hbs": path4,
      "component6/index.hbs": path6,
      "component7/index.hbs": path7,
      "component8/index.hbs": path8,
      "component9/index.hbs": path9,
    },
    fileContents,
  });
  app.set("views", [path.join(process.cwd(), "/tests/mocks/srcFolder/")]);
  app.set(
    "config",
    deepMerge(config.defaultUserConfig, {
      files: {
        templates: {
          extension: "hbs",
        },
      },
      components: {
        folder: "tests/mocks/srcFolder",
      },
      projectName: userProjectName,
      ui: {
        validations: {
          accessibility: true,
          html: true,
        },
      },
    })
  );

  res = {
    render: jest.fn(),
  };
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();

  app.set("state").fileContents[
    path.join(process.cwd(), "/tests/mocks/srcFolder/data.json")
  ] = null;
});

describe("lib/render/index", () => {
  describe("renderMainIndex", () => {
    test("renders main.hbs", async (done) => {
      res.render = jest.fn();

      await render.renderMainIndex({ app, res });

      expect(res.render.mock.calls[0][0]).toEqual("main.hbs");
      expect(res.render.mock.calls[0][1]).toEqual({
        folders,
        iframeSrc: "/component?file=all&embedded=true",
        indexPath: "/component?file=all&embedded=true",
        showAll: true,
        hideTests: true,
        theme: {},
        tests,
        projectName,
        userProjectName,
        miyagiDev: false,
        miyagiProd: true,
        isBuild: undefined,
        basePath: "/",
      });

      done();
    });
  });

  describe("renderMainComponent", () => {
    describe("with variation", () => {
      test("renders index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderMainComponent({
          app,
          res,
          file: path.dirname(component),
          variation,
        });

        expect(res.render.mock.calls[0][0]).toEqual("main.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          folders,
          iframeSrc: `/component?file=${path.dirname(
            component
          )}&variation=${variation}&embedded=true`,
          indexPath: "/component?file=all&embedded=true",
          requestedComponent: path.dirname(component),
          requestedVariation: variation,
          hideTests: false,
          theme: {},
          tests,
          projectName,
          userProjectName,
          miyagiDev: false,
          miyagiProd: true,
          isBuild: undefined,
          basePath: "/",
        });

        done();
      });
    });

    describe("without variation", () => {
      test("renders index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderMainComponent({
          app,
          res,
          file: path.dirname(component),
        });

        expect(res.render.mock.calls[0][0]).toEqual("main.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          folders,
          iframeSrc: `/component?file=${path.dirname(component)}&embedded=true`,
          indexPath: "/component?file=all&embedded=true",
          requestedComponent: path.dirname(component),
          requestedVariation: undefined,
          hideTests: false,
          theme: {},
          tests,
          projectName,
          userProjectName,
          miyagiDev: false,
          miyagiProd: true,
          isBuild: undefined,
          basePath: "/",
        });

        done();
      });
    });
  });

  describe("renderMain404", () => {
    describe("with variation", () => {
      test("renders index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderMain404({
          app,
          res,
          file: path.dirname(component),
          variation,
        });

        expect(res.render.mock.calls[0][0]).toEqual("main.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          folders,
          iframeSrc: `/component?file=${path.dirname(
            component
          )}&variation=${variation}&embedded=true`,
          requestedComponent: null,
          requestedVariation: null,
          hideTests: true,
          theme: {},
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false,
          miyagiDev: false,
          miyagiProd: true,
          isBuild: undefined,
          indexPath: "/component?file=all&embedded=true",
          basePath: "/",
        });

        done();
      });
    });

    describe("without variation", () => {
      test("renders index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderMain404({
          app,
          res,
          file: path.dirname(component),
        });

        expect(res.render.mock.calls[0][0]).toEqual("main.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          folders,
          iframeSrc: `/component?file=${path.dirname(component)}&embedded=true`,
          requestedComponent: null,
          requestedVariation: null,
          hideTests: true,
          theme: {},
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false,
          miyagiDev: false,
          miyagiProd: true,
          isBuild: undefined,
          indexPath: "/component?file=all&embedded=true",
          basePath: "/",
        });

        done();
      });
    });
  });

  describe("renderIframeVariation", () => {
    describe("with global data", () => {
      test("renders component.hbs with data merged with global data", async (done) => {
        addGlobalData();
        res.render = jest.fn();

        await render.renderIframeVariation({
          app,
          res,
          file: path.dirname(component),
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variation.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "component1global\n",
          htmlValidation: true,
          accessibilityValidation: null,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: undefined,
          standalone: true,
        });

        done();
      });
    });

    describe("with variation", () => {
      test("renders component.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframeVariation({
          app,
          res,
          file: path.dirname(component),
          variation: "variation1",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variation.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "component11\n",
          htmlValidation: true,
          accessibilityValidation: null,
          standaloneUrl: null,
          standalone: true,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: undefined,
        });

        done();
      });
    });

    describe("without variation", () => {
      test("renders component.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframeVariation({
          app,
          res,
          file: "component2",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variation.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "component2\n",
          htmlValidation: true,
          accessibilityValidation: null,
          standaloneUrl: null,
          standalone: true,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: undefined,
        });

        done();
      });
    });

    describe("with variation not having a data key", () => {
      test("renders component.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframeVariation({
          app,
          res,
          file: "component8",
          variation: "variation1",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variation.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "component8\n",
          htmlValidation: true,
          accessibilityValidation: null,
          standaloneUrl: null,
          standalone: true,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: undefined,
        });

        done();
      });
    });

    describe("rendering an empty component", () => {
      test("renders component.hbs without error", async (done) => {
        res.render = jest.fn();

        await render.renderIframeVariation({
          app,
          res,
          file: "component5",
          variation: "component5",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variation.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "",
          htmlValidation: true,
          accessibilityValidation: null,
          standaloneUrl: null,
          standalone: true,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: undefined,
        });

        done();
      });
    });

    describe("embedded=true", () => {
      test("renders iframe_component_variation.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframeVariation({
          app,
          res,
          file: path.dirname(component),
          variation: "component1",
          embedded: true,
        });

        expect(res.render.mock.calls[0][0]).toEqual(
          "iframe_component_variation.hbs"
        );
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "component1\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: `/component?file=${path.dirname(
            component
          )}&variation=component1`,
          standalone: false,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: undefined,
        });

        done();
      });
    });

    describe("embedded=false", () => {
      test("renders component.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframeVariation({
          app,
          res,
          file: path.dirname(component),
          embedded: false,
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variation.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "component1\n",
          htmlValidation: true,
          accessibilityValidation: null,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: undefined,
          standalone: true,
        });

        done();
      });
    });
  });

  describe("renderIframeComponent", () => {
    describe("with global data", () => {
      test("renders iframe_component.hbs with the global data merged into the variations data", async (done) => {
        addGlobalData();
        res.render = jest.fn();
        const folder = "tests/mocks/srcFolder/component1";

        await render.renderIframeComponent({
          app,
          res,
          file: "component1",
        });

        expect(res.render.mock.calls[0][0]).toEqual("iframe_component.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          variations: [
            {
              file: "component1/index.hbs",
              html: "component1global\n",
              variation: "default",
              standaloneUrl: "/component?file=component1&variation=default",
              url: "/component?file=component1&variation=default&embedded=true",
            },
            {
              file: "component1/index.hbs",
              html: "component11global\n",
              variation: "variation1",
              standaloneUrl: "/component?file=component1&variation=variation1",
              url:
                "/component?file=component1&variation=variation1&embedded=true",
            },
            {
              file: "component1/index.hbs",
              html: "component12global\n",
              variation: "variation2",
              standaloneUrl: "/component?file=component1&variation=variation2",
              url:
                "/component?file=component1&variation=variation2&embedded=true",
            },
          ],
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          folder,
          projectName,
          userProjectName,
          isBuild: undefined,
          schema: null,
          mocks: {
            type: "json",
            selected: true,
            file: `${folder}/mocks.json`,
            string: `{
  "component": "component1",
  "$variants": [
    {
      "$name": "variation1",
      "variation": 1
    },
    {
      "$name": "variation2",
      "variation": 2
    }
  ]
}`,
          },
          renderFileTabs: true,
          name: "component1",
          documentation: undefined,
          theme: {},
          schemaError: null,
          template: null,
        });
        expect(typeof res.render.mock.calls[0][2]).toEqual("function");

        done();
      });
    });

    describe("component has variations", () => {
      describe("with data key", () => {
        test("renders iframe_component.hbs", async (done) => {
          res.render = jest.fn();
          const folder = "tests/mocks/srcFolder/component1";

          await render.renderIframeComponent({
            app,
            res,
            file: path.dirname(component),
          });

          expect(res.render.mock.calls[0][0]).toEqual("iframe_component.hbs");
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component1/index.hbs",
                html: "component1\n",
                variation: "default",
                standaloneUrl: "/component?file=component1&variation=default",
                url:
                  "/component?file=component1&variation=default&embedded=true",
              },
              {
                file: "component1/index.hbs",
                html: "component11\n",
                variation: "variation1",
                standaloneUrl:
                  "/component?file=component1&variation=variation1",
                url:
                  "/component?file=component1&variation=variation1&embedded=true",
              },
              {
                file: "component1/index.hbs",
                html: "component12\n",
                variation: "variation2",
                standaloneUrl:
                  "/component?file=component1&variation=variation2",
                url:
                  "/component?file=component1&variation=variation2&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder,
            projectName,
            userProjectName,
            isBuild: undefined,
            schema: null,
            mocks: {
              type: "json",
              selected: true,
              file: `${folder}/mocks.json`,
              string: `{
  "component": "component1",
  "$variants": [
    {
      "$name": "variation1",
      "variation": 1
    },
    {
      "$name": "variation2",
      "variation": 2
    }
  ]
}`,
            },
            renderFileTabs: true,
            name: "component1",
            documentation: undefined,
            theme: {},
            schemaError: null,
            template: null,
          });
          expect(typeof res.render.mock.calls[0][2]).toEqual("function");

          done();
        });
      });

      describe("without data key", () => {
        test("renders iframe_component.hbs", async (done) => {
          res.render = jest.fn();
          const folder = "tests/mocks/srcFolder/component3";

          await render.renderIframeComponent({
            app,
            res,
            file: "component3",
          });

          expect(res.render.mock.calls[0][0]).toEqual("iframe_component.hbs");
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component3/index.hbs",
                html: "component31\n",
                variation: "variation1",
                standaloneUrl:
                  "/component?file=component3&variation=variation1",
                url:
                  "/component?file=component3&variation=variation1&embedded=true",
              },
              {
                file: "component3/index.hbs",
                html: "component32\n",
                variation: "variation2",
                standaloneUrl:
                  "/component?file=component3&variation=variation2",
                url:
                  "/component?file=component3&variation=variation2&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder,
            projectName,
            userProjectName,
            isBuild: undefined,
            documentation: undefined,
            theme: {},
            schema: null,
            mocks: {
              type: "json",
              selected: true,
              file: `${folder}/mocks.json`,
              string: `{
  "$variants": [
    {
      "$name": "variation1",
      "variation": 1
    },
    {
      "$name": "variation2",
      "variation": 2
    }
  ]
}`,
            },
            renderFileTabs: true,
            name: "component3",
            schemaError: null,
            template: null,
          });
          expect(typeof res.render.mock.calls[0][2]).toEqual("function");

          done();
        });
      });

      describe("variation throws an error", () => {
        test("renders iframe_component.hbs", async (done) => {
          res.render = jest.fn();
          const folder = "tests/mocks/srcFolder/component6";

          await render.renderIframeComponent({
            app,
            res,
            file: "component6",
          });

          expect(res.render.mock.calls[0][0]).toEqual("iframe_component.hbs");
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component6/index.hbs",
                html:
                  '<p class="MiyagiError">Error: The partial doesntexist.hbs could not be found</p>',
                variation: "variation1",
                standaloneUrl:
                  "/component?file=component6&variation=variation1",
                url:
                  "/component?file=component6&variation=variation1&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder,
            projectName,
            userProjectName,
            isBuild: undefined,
            documentation: undefined,
            theme: {},
            schema: null,
            mocks: {
              type: "json",
              selected: true,
              file: `${folder}/mocks.json`,
              string: `{
  "$variants": [
    {
      "$name": "variation1"
    }
  ]
}`,
            },
            renderFileTabs: true,
            name: "component6",
            schemaError: null,
            template: null,
          });
          expect(typeof res.render.mock.calls[0][2]).toEqual("function");

          done();
        });
      });

      describe("variation doesn't have a name", () => {
        test("renders iframe_component.hbs without that variation", async (done) => {
          res.render = jest.fn();
          const folder = "tests/mocks/srcFolder/component7";

          await render.renderIframeComponent({
            app,
            res,
            file: "component7",
          });

          expect(res.render.mock.calls[0][0]).toEqual("iframe_component.hbs");
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component7/index.hbs",
                html: "component7\n",
                variation: "foo",
                standaloneUrl: "/component?file=component7&variation=foo",
                url: "/component?file=component7&variation=foo&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder,
            projectName,
            userProjectName,
            isBuild: undefined,
            documentation: undefined,
            theme: {},
            schema: null,
            mocks: {
              type: "json",
              selected: true,
              file: `${folder}/mocks.json`,
              string: `{
  "$variants": [
    {},
    {
      "$name": "foo"
    }
  ]
}`,
            },
            renderFileTabs: true,
            name: "component7",
            schemaError: null,
            template: null,
          });

          done();
        });
      });

      describe("component has data, but variation doesn't have data", () => {
        test.only("renders iframe_component.hbs", async (done) => {
          res.render = jest.fn();
          const folder = "tests/mocks/srcFolder/component9";

          await render.renderIframeComponent({
            app,
            res,
            file: "component9",
          });

          expect(res.render.mock.calls[0][0]).toEqual("iframe_component.hbs");
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component9/index.hbs",
                html: "component9\n",
                variation: "default",
                standaloneUrl: "/component?file=component9&variation=default",
                url:
                  "/component?file=component9&variation=default&embedded=true",
              },
              {
                file: "component9/index.hbs",
                html: "component9\n",
                variation: "variation1",
                standaloneUrl:
                  "/component?file=component9&variation=variation1",
                url:
                  "/component?file=component9&variation=variation1&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder,
            projectName,
            userProjectName,
            isBuild: undefined,
            schema: null,
            mocks: {
              type: "json",
              selected: true,
              file: `${folder}/mocks.json`,
              string: `{
  "some": "data",
  "$variants": [
    {
      "$name": "variation1"
    }
  ]
}`,
            },
            renderFileTabs: true,
            name: "component9",
            documentation: undefined,
            theme: {
              mode: "light",
            },
            schemaError: null,
            template: null,
          });

          done();
        });
      });
    });

    describe("component doesn't have variations", () => {
      describe("embedded=true", () => {
        test("renders iframe_component.hbs", async (done) => {
          res.render = jest.fn();
          const folder = "tests/mocks/srcFolder/component2";

          await render.renderIframeComponent({
            app,
            res,
            file: "component2",
          });

          expect(res.render.mock.calls[0][0]).toEqual("iframe_component.hbs");
          expect(res.render.mock.calls[0][1]).toEqual({
            a11yTestsPreload: true,
            folder,
            documentation: undefined,
            theme: {},
            dev: false,
            prod: false,
            projectName,
            userProjectName,
            isBuild: undefined,
            schema: null,
            mocks: {
              type: "json",
              selected: true,
              file: `${folder}/mocks.json`,
              string: `{
  "component": "component2"
}`,
            },
            renderFileTabs: true,
            name: "component2",
            variations: [
              {
                file: "component2/index.hbs",
                html: "component2\n",
                standaloneUrl: "/component?file=component2&variation=default",
                url:
                  "/component?file=component2&variation=default&embedded=true",
                variation: "default",
              },
            ],
            schemaError: null,
            template: null,
          });

          done();
        });
      });

      describe("embedded=false", () => {
        test("renders iframe_component.hbs", async (done) => {
          res.render = jest.fn();
          const folder = "tests/mocks/srcFolder/component2";

          await render.renderIframeComponent({
            app,
            res,
            file: "component2",
          });

          expect(res.render.mock.calls[0][0]).toEqual("iframe_component.hbs");
          expect(res.render.mock.calls[0][1]).toEqual({
            documentation: undefined,
            a11yTestsPreload: true,
            folder,
            theme: {},
            dev: false,
            prod: false,
            projectName,
            userProjectName,
            isBuild: undefined,
            schema: null,
            mocks: {
              type: "json",
              selected: true,
              file: `${folder}/mocks.json`,
              string: `{
  "component": "component2"
}`,
            },
            renderFileTabs: true,
            name: "component2",
            variations: [
              {
                file: "component2/index.hbs",
                html: "component2\n",
                standaloneUrl: "/component?file=component2&variation=default",
                url:
                  "/component?file=component2&variation=default&embedded=true",
                variation: "default",
              },
            ],
            schemaError: null,
            template: null,
          });

          done();
        });
      });
    });

    describe("component doesn't have json data", () => {
      test("renders iframe_component.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframeComponent({
          app,
          res,
          file: "component4",
        });

        expect(res.render.mock.calls[0][0]).toEqual("iframe_component.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          a11yTestsPreload: true,
          folder: "tests/mocks/srcFolder/component4",
          documentation: undefined,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: undefined,
          theme: {},
          variations: [
            {
              file: "component4/index.hbs",
              html: "component4\n",
              standaloneUrl: "/component?file=component4&variation=default",
              url: "/component?file=component4&variation=default&embedded=true",
              variation: "default",
            },
          ],
          schema: null,
          mocks: null,
          renderFileTabs: false,
          name: "component4",
          schemaError: null,
          template: null,
        });

        done();
      });
    });
  });

  describe("renderIframeIndex", () => {
    describe("with global data", () => {
      test("renders iframe_index.hbs with the global data merged with the components data", async (done) => {
        addGlobalData();
        res.render = jest.fn();

        await render.renderIframeIndex({ app, res });

        expect(res.render.mock.calls[0][0]).toEqual("iframe_index.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          components: [
            {
              name: "component1",
              folders: [],
              html: "component1global\n",
              url: "/component?file=component1&embedded=true",
            },
            {
              name: "component2",
              folders: [],
              html: "component2\n",
              url: "/component?file=component2&embedded=true",
            },
            {
              name: "component3",
              folders: [],
              html: "component31\n",
              url: "/component?file=component3&embedded=true",
            },
            {
              name: "component4",
              folders: [],
              html: "component4\n",
              url: "/component?file=component4&embedded=true",
            },
            {
              name: "component6",
              folders: [],
              html:
                '<p class="MiyagiError">Error: The partial doesntexist.hbs could not be found</p>',
              url: "/component?file=component6&embedded=true",
            },
            {
              name: "component7",
              folders: [],
              html: "component7\n",
              url: "/component?file=component7&embedded=true",
            },
            {
              name: "component8",
              folders: [],
              html: "component8\n",
              url: "/component?file=component8&embedded=true",
            },
          ],
          theme: {},
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName,
          isBuild: undefined,
          documentation: undefined,
          renderComponentOverview: false,
        });
        expect(typeof res.render.mock.calls[0][2]).toEqual("function");

        done();
      });
    });

    describe("embedded=true", () => {
      test("renders iframe_index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframeIndex({ app, res });

        expect(res.render.mock.calls[0][0]).toEqual("iframe_index.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          components: [
            {
              name: "component1",
              folders: [],
              html: "component1\n",
              url: "/component?file=component1&embedded=true",
            },
            {
              name: "component2",
              folders: [],
              html: "component2\n",
              url: "/component?file=component2&embedded=true",
            },
            {
              name: "component3",
              folders: [],
              html: "component31\n",
              url: "/component?file=component3&embedded=true",
            },
            {
              name: "component4",
              folders: [],
              html: "component4\n",
              url: "/component?file=component4&embedded=true",
            },
            {
              name: "component6",
              folders: [],
              html:
                '<p class="MiyagiError">Error: The partial doesntexist.hbs could not be found</p>',
              url: "/component?file=component6&embedded=true",
            },
            {
              name: "component7",
              folders: [],
              html: "component7\n",
              url: "/component?file=component7&embedded=true",
            },
            {
              name: "component8",
              folders: [],
              html: "component8\n",
              url: "/component?file=component8&embedded=true",
            },
          ],
          theme: {},
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName,
          isBuild: undefined,
          documentation: undefined,
          renderComponentOverview: false,
        });
        expect(typeof res.render.mock.calls[0][2]).toEqual("function");

        done();
      });
    });

    describe("embedded=false", () => {
      test("renders iframe_index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframeIndex({ app, res });

        expect(res.render.mock.calls[0][0]).toEqual("iframe_index.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          components: [
            {
              name: "component1",
              html: "component1\n",
              url: "/component?file=component1&embedded=true",
              folders: [],
            },
            {
              name: "component2",
              html: "component2\n",
              url: "/component?file=component2&embedded=true",
              folders: [],
            },
            {
              name: "component3",
              html: "component31\n",
              url: "/component?file=component3&embedded=true",
              folders: [],
            },
            {
              name: "component4",
              html: "component4\n",
              url: "/component?file=component4&embedded=true",
              folders: [],
            },
            {
              name: "component6",
              html:
                '<p class="MiyagiError">Error: The partial doesntexist.hbs could not be found</p>',
              url: "/component?file=component6&embedded=true",
              folders: [],
            },
            {
              name: "component7",
              html: "component7\n",
              url: "/component?file=component7&embedded=true",
              folders: [],
            },
            {
              name: "component8",
              html: "component8\n",
              url: "/component?file=component8&embedded=true",
              folders: [],
            },
          ],
          theme: {},
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName,
          isBuild: undefined,
          documentation: undefined,
          renderComponentOverview: false,
        });
        expect(typeof res.render.mock.calls[0][2]).toEqual("function");

        done();
      });
    });
  });

  describe("renderIframe404", () => {
    describe("embedded=true", () => {
      test("renders iframe_component_variation.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframe404({
          app,
          res,
          embedded: true,
          target: component,
        });

        expect(res.render.mock.calls[0][0]).toEqual(
          "iframe_component_variation.hbs"
        );
        expect(res.render.mock.calls[0][1]).toEqual({
          html: `<p class="MiyagiError">${component} not found.</p>`,
          theme: {},
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false,
          isBuild: undefined,
        });

        done();
      });
    });

    describe("embedded=false", () => {
      test("renders component.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderIframe404({
          app,
          res,
          embedded: false,
          target: component,
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variation.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: `<p class="MiyagiError">${component} not found.</p>`,
          theme: {},
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false,
          isBuild: undefined,
        });

        done();
      });
    });
  });
});
