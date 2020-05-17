const render = require("../../../lib/render");
const tests = require("../../../lib/render/tests.json");
const config = require("../../../lib/config.json");
const express = require("express");
const engines = require("consolidate");
const path = require("path");
const deepMerge = require("deepmerge");

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

function addGlobalData() {
  app.get("state").fileContents[
    path.join(process.cwd(), "/tests/mocks/srcFolder/data.json")
  ] = {
    global: "global",
  };
}

fileContents[path1.replace("index.hbs", "mocks.json")] = {
  data: {
    component: "component1",
  },
  variations: [
    { name: "variation1", data: { variation: 1 } },
    { name: "variation2", data: { variation: 2 } },
  ],
};
fileContents[path2.replace("index.hbs", "mocks.json")] = {
  data: { component: "component2" },
};
fileContents[path3.replace("index.hbs", "mocks.json")] = {
  variations: [
    { name: "variation1", data: { variation: 1 } },
    { name: "variation2", data: { variation: 2 } },
  ],
};
fileContents[path6.replace("index.hbs", "mocks.json")] = {
  variations: [
    {
      name: "variation1",
      data: {},
    },
  ],
};
fileContents[path7.replace("index.hbs", "mocks.json")] = {
  variations: [{}, { name: "foo" }],
};
fileContents[path8.replace("index.hbs", "mocks.json")] = {
  variations: [
    {
      name: "variation1",
    },
  ],
};
fileContents[path9.replace("index.hbs", "mocks.json")] = {
  data: {},
  variations: [
    {
      name: "variation1",
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
      srcFolder: "tests/mocks/srcFolder/",
      projectName: userProjectName,
      validations: {
        accessibility: true,
        html: true,
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
  describe("renderMain", () => {
    test("renders index.hbs", async (done) => {
      res.render = jest.fn();

      await render.renderMain({ app, res });

      expect(res.render.mock.calls[0][0]).toEqual("index.hbs");
      expect(res.render.mock.calls[0][1]).toEqual({
        folders,
        iframeSrc: "/component?file=all&embedded=true",
        indexPath: "/component?file=all&embedded=true",
        showAll: true,
        hideTests: true,
        theme: undefined,
        tests,
        projectName,
        userProjectName,
        headmanDev: false,
        headmanProd: true,
        isBuild: undefined,
      });

      done();
    });
  });

  describe("renderMainWithComponent", () => {
    describe("with variation", () => {
      test("renders index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderMainWithComponent({
          app,
          res,
          file: component,
          variation,
        });

        expect(res.render.mock.calls[0][0]).toEqual("index.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          folders,
          iframeSrc: `/component?file=${component}&variation=${variation}&embedded=true`,
          indexPath: "/component?file=all&embedded=true",
          requestedComponent: component,
          requestedVariation: variation,
          hideTests: false,
          theme: undefined,
          tests,
          projectName,
          userProjectName,
          headmanDev: false,
          headmanProd: true,
          isBuild: undefined,
        });

        done();
      });
    });

    describe("without variation", () => {
      test("renders index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderMainWithComponent({ app, res, file: component });

        expect(res.render.mock.calls[0][0]).toEqual("index.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          folders,
          iframeSrc: `/component?file=${component}&embedded=true`,
          indexPath: "/component?file=all&embedded=true",
          requestedComponent: component,
          requestedVariation: undefined,
          hideTests: false,
          theme: undefined,
          tests,
          projectName,
          userProjectName,
          headmanDev: false,
          headmanProd: true,
          isBuild: undefined,
        });

        done();
      });
    });
  });

  describe("renderMainWith404", () => {
    describe("with variation", () => {
      test("renders index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderMainWith404({
          app,
          res,
          file: component,
          variation,
        });

        expect(res.render.mock.calls[0][0]).toEqual("index.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          folders,
          iframeSrc: `/component?file=${component}&variation=${variation}&embedded=true`,
          requestedComponent: null,
          requestedVariation: null,
          hideTests: true,
          theme: undefined,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false,
          headmanDev: false,
          headmanProd: true,
          isBuild: undefined,
        });

        done();
      });
    });

    describe("without variation", () => {
      test("renders index.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderMainWith404({ app, res, file: component });

        expect(res.render.mock.calls[0][0]).toEqual("index.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          folders,
          iframeSrc: `/component?file=${component}&embedded=true`,
          requestedComponent: null,
          requestedVariation: null,
          hideTests: true,
          theme: undefined,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false,
          headmanDev: false,
          headmanProd: true,
          isBuild: undefined,
        });

        done();
      });
    });
  });

  describe("renderComponent", () => {
    describe("with global data", () => {
      test("renders component.hbs with data merged with global data", async (done) => {
        addGlobalData();
        res.render = jest.fn();

        await render.renderComponent({ app, res, file: component });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
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

        await render.renderComponent({
          app,
          res,
          file: component,
          variation: "variation1",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
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

        await render.renderComponent({
          app,
          res,
          file: "component2/index.hbs",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
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

        await render.renderComponent({
          app,
          res,
          file: "component8/index.hbs",
          variation: "variation1",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
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

    describe("rendering throwing an error", () => {
      test("renders component.hbs with error", async (done) => {
        res.render = jest.fn();

        await render.renderComponent({
          app,
          res,
          file: "component5/index.hbs",
          variation: "component5",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: '<p class="HeadmanError">Component couldn\'t be rendered.</p>',
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
      test("renders component_frame.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderComponent({
          app,
          res,
          file: component,
          variation: "component1",
          embedded: true,
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_frame.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "component1\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: `/component?file=${component}&variation=component1`,
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

        await render.renderComponent({
          app,
          res,
          file: component,
          embedded: false,
        });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
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

  describe("renderComponentVariations", () => {
    describe("with global data", () => {
      test("renders component_variations.hbs with the global data merged into the variations data", async (done) => {
        addGlobalData();
        res.render = jest.fn();

        await render.renderComponentVariations({
          app,
          res,
          file: "component1/index.hbs",
          embedded: true,
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variations.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          variations: [
            {
              file: "component1/index.hbs",
              html: "component1global\n",
              variation: "default",
              url:
                "/component?file=component1/index.hbs&variation=default&embedded=true",
            },
            {
              file: "component1/index.hbs",
              html: "component11global\n",
              variation: "variation1",
              url:
                "/component?file=component1/index.hbs&variation=variation1&embedded=true",
            },
            {
              file: "component1/index.hbs",
              html: "component12global\n",
              variation: "variation2",
              url:
                "/component?file=component1/index.hbs&variation=variation2&embedded=true",
            },
          ],
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          folder: "component1",
          projectName,
          userProjectName,
          isBuild: undefined,
          schema: undefined,
          name: "index",
          documentation: undefined,
          theme: undefined,
          status: null,
        });
        expect(typeof res.render.mock.calls[0][2]).toEqual("function");

        done();
      });
    });

    describe("component has variations", () => {
      describe("with data key", () => {
        test("renders component_variations.hbs", async (done) => {
          res.render = jest.fn();

          await render.renderComponentVariations({
            app,
            res,
            file: component,
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component1/index.hbs",
                html: "component1\n",
                variation: "default",
                url:
                  "/component?file=component1/index.hbs&variation=default&embedded=true",
              },
              {
                file: "component1/index.hbs",
                html: "component11\n",
                variation: "variation1",
                url:
                  "/component?file=component1/index.hbs&variation=variation1&embedded=true",
              },
              {
                file: "component1/index.hbs",
                html: "component12\n",
                variation: "variation2",
                url:
                  "/component?file=component1/index.hbs&variation=variation2&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "component1",
            projectName,
            userProjectName,
            isBuild: undefined,
            schema: undefined,
            name: "index",
            documentation: undefined,
            theme: undefined,
            status: null,
          });
          expect(typeof res.render.mock.calls[0][2]).toEqual("function");

          done();
        });
      });

      describe("without data key", () => {
        test("renders component_variations.hbs", async (done) => {
          res.render = jest.fn();

          await render.renderComponentVariations({
            app,
            res,
            file: "component3/index.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component3/index.hbs",
                html: "component31\n",
                variation: "variation1",
                url:
                  "/component?file=component3/index.hbs&variation=variation1&embedded=true",
              },
              {
                file: "component3/index.hbs",
                html: "component32\n",
                variation: "variation2",
                url:
                  "/component?file=component3/index.hbs&variation=variation2&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "component3",
            projectName,
            userProjectName,
            isBuild: undefined,
            documentation: undefined,
            theme: undefined,
            schema: undefined,
            name: "index",
            status: null,
          });
          expect(typeof res.render.mock.calls[0][2]).toEqual("function");

          done();
        });
      });

      describe("variation throws an error", () => {
        test("renders component_variations.hbs", async (done) => {
          res.render = jest.fn();

          await render.renderComponentVariations({
            app,
            res,
            file: "component6/index.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component6/index.hbs",
                html:
                  '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>',
                variation: "variation1",
                url:
                  "/component?file=component6/index.hbs&variation=variation1&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "component6",
            projectName,
            userProjectName,
            isBuild: undefined,
            documentation: undefined,
            theme: undefined,
            schema: undefined,
            name: "index",
            status: null,
          });
          expect(typeof res.render.mock.calls[0][2]).toEqual("function");

          done();
        });
      });

      describe("variation doesn't have a name", () => {
        test("renders component_variations.hbs without that variation", async (done) => {
          res.render = jest.fn();

          await render.renderComponentVariations({
            app,
            res,
            file: "component7/index.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component7/index.hbs",
                html: "component7\n",
                variation: "foo",
                url:
                  "/component?file=component7/index.hbs&variation=foo&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "component7",
            projectName,
            userProjectName,
            isBuild: undefined,
            documentation: undefined,
            theme: undefined,
            schema: undefined,
            name: "index",
            status: null,
          });

          done();
        });
      });

      describe("component has data, but variation doesn't have data", () => {
        test("renders component_variations.hbs", async (done) => {
          res.render = jest.fn();

          await render.renderComponentVariations({
            app,
            res,
            file: "component9/index.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component9/index.hbs",
                html: "component9\n",
                variation: "default",
                url:
                  "/component?file=component9/index.hbs&variation=default&embedded=true",
              },
              {
                file: "component9/index.hbs",
                html: "component9\n",
                variation: "variation1",
                url:
                  "/component?file=component9/index.hbs&variation=variation1&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "component9",
            projectName,
            userProjectName,
            isBuild: undefined,
            schema: undefined,
            name: "index",
            documentation: undefined,
            theme: undefined,
            status: null,
          });

          done();
        });
      });
    });

    describe("component doesn't have variations", () => {
      describe("embedded=true", () => {
        test("renders component_variations.hbs", async (done) => {
          res.render = jest.fn();

          await render.renderComponentVariations({
            app,
            res,
            file: "component2/index.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            a11yTestsPreload: true,
            folder: "component2",
            documentation: undefined,
            theme: undefined,
            dev: false,
            prod: false,
            projectName,
            userProjectName,
            isBuild: undefined,
            schema: undefined,
            name: "index",
            variations: [
              {
                file: "component2/index.hbs",
                html: "component2\n",
                url:
                  "/component?file=component2/index.hbs&variation=default&embedded=true",
                variation: "default",
              },
            ],
            status: null,
          });

          done();
        });
      });

      describe("embedded=false", () => {
        test("renders component_variations.hbs", async (done) => {
          res.render = jest.fn();

          await render.renderComponentVariations({
            app,
            res,
            file: "component2/index.hbs",
            embedded: false,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            documentation: undefined,
            a11yTestsPreload: true,
            folder: "component2",
            theme: undefined,
            dev: false,
            prod: false,
            projectName,
            userProjectName,
            isBuild: undefined,
            schema: undefined,
            name: "index",
            variations: [
              {
                file: "component2/index.hbs",
                html: "component2\n",
                url:
                  "/component?file=component2/index.hbs&variation=default&embedded=true",
                variation: "default",
              },
            ],
            status: null,
          });

          done();
        });
      });
    });

    describe("component doesn't have json data", () => {
      test("renders component_variations.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderComponentVariations({
          app,
          res,
          file: "component4/index.hbs",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variations.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          a11yTestsPreload: true,
          folder: "component4",
          documentation: undefined,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: undefined,
          theme: undefined,
          variations: [
            {
              file: "component4/index.hbs",
              html: "component4\n",
              url:
                "/component?file=component4/index.hbs&variation=default&embedded=true",
              variation: "default",
            },
          ],
          schema: undefined,
          name: "index",
          status: null,
        });

        done();
      });
    });
  });

  describe("renderComponentOverview", () => {
    describe("with global data", () => {
      test("renders component_overview.hbs with the global data merged with the components data", async (done) => {
        addGlobalData();
        res.render = jest.fn();

        await render.renderComponentOverview({ app, res, embedded: false });

        expect(res.render.mock.calls[0][0]).toEqual("component_overview.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          components: [
            {
              name: "index",
              folders: [],
              html: "component1global\n",
              url: "/component?file=component1/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component2\n",
              url: "/component?file=component2/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component31\n",
              url: "/component?file=component3/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component4\n",
              url: "/component?file=component4/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html:
                '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>',
              url: "/component?file=component6/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component7\n",
              url: "/component?file=component7/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component8\n",
              url: "/component?file=component8/index.hbs&embedded=true",
            },
          ],
          theme: undefined,
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName,
          isBuild: undefined,
          documentation: undefined,
        });
        expect(typeof res.render.mock.calls[0][2]).toEqual("function");

        done();
      });
    });

    describe("embedded=true", () => {
      test("renders component_overview.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderComponentOverview({ app, res, embedded: true });

        expect(res.render.mock.calls[0][0]).toEqual("component_overview.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          components: [
            {
              name: "index",
              folders: [],
              html: "component1\n",
              url: "/component?file=component1/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component2\n",
              url: "/component?file=component2/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component31\n",
              url: "/component?file=component3/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component4\n",
              url: "/component?file=component4/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html:
                '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>',
              url: "/component?file=component6/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component7\n",
              url: "/component?file=component7/index.hbs&embedded=true",
            },
            {
              name: "index",
              folders: [],
              html: "component8\n",
              url: "/component?file=component8/index.hbs&embedded=true",
            },
          ],
          theme: undefined,
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName,
          isBuild: undefined,
          documentation: undefined,
        });
        expect(typeof res.render.mock.calls[0][2]).toEqual("function");

        done();
      });
    });

    describe("embedded=false", () => {
      test("renders component_overview.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderComponentOverview({ app, res, embedded: false });

        expect(res.render.mock.calls[0][0]).toEqual("component_overview.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          components: [
            {
              name: "index",
              html: "component1\n",
              url: "/component?file=component1/index.hbs&embedded=true",
              folders: [],
            },
            {
              name: "index",
              html: "component2\n",
              url: "/component?file=component2/index.hbs&embedded=true",
              folders: [],
            },
            {
              name: "index",
              html: "component31\n",
              url: "/component?file=component3/index.hbs&embedded=true",
              folders: [],
            },
            {
              name: "index",
              html: "component4\n",
              url: "/component?file=component4/index.hbs&embedded=true",
              folders: [],
            },
            {
              name: "index",
              html:
                '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>',
              url: "/component?file=component6/index.hbs&embedded=true",
              folders: [],
            },
            {
              name: "index",
              html: "component7\n",
              url: "/component?file=component7/index.hbs&embedded=true",
              folders: [],
            },
            {
              name: "index",
              html: "component8\n",
              url: "/component?file=component8/index.hbs&embedded=true",
              folders: [],
            },
          ],
          theme: undefined,
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName,
          isBuild: undefined,
          documentation: undefined,
        });
        expect(typeof res.render.mock.calls[0][2]).toEqual("function");

        done();
      });
    });
  });

  describe("renderComponentNotFound", () => {
    describe("embedded=true", () => {
      test("renders component_frame.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderComponentNotFound({
          app,
          res,
          embedded: true,
          target: component,
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_frame.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: `<p class="HeadmanError">${component} not found.</p>`,
          theme: undefined,
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

        await render.renderComponentNotFound({
          app,
          res,
          embedded: false,
          target: component,
        });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: `<p class="HeadmanError">${component} not found.</p>`,
          theme: undefined,
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
