const render = require("../../../lib/render");
const tests = require("../../../lib/render/tests.json");
const config = require("../../../lib/config.json");
const express = require("express");
const engines = require("consolidate");
const path = require("path");

const component = "component1.hbs";
const variation = "variation";
const menu = "menu";
const userProjectName = "projectName";
const path1 = path.join(process.cwd(), "/tests/mocks/srcFolder/component1.hbs");
const path2 = path.join(process.cwd(), "/tests/mocks/srcFolder/component2.hbs");
const path3 = path.join(process.cwd(), "/tests/mocks/srcFolder/component3.hbs");
const path4 = path.join(process.cwd(), "/tests/mocks/srcFolder/component4.hbs");
const path6 = path.join(process.cwd(), "/tests/mocks/srcFolder/component6.hbs");
const path7 = path.join(process.cwd(), "/tests/mocks/srcFolder/component7.hbs");
const path8 = path.join(process.cwd(), "/tests/mocks/srcFolder/component8.hbs");
const path9 = path.join(process.cwd(), "/tests/mocks/srcFolder/component9.hbs");
const fileContents = {};

function addGlobalData() {
  app.get("state").fileContents[
    path.join(process.cwd(), "/tests/mocks/srcFolder/data.json")
  ] = {
    global: "global",
  };
}

fileContents[path1.replace(".hbs", ".json")] = {
  data: {
    component: "component1",
  },
  variations: [
    { name: "variation1", data: { variation: 1 } },
    { name: "variation2", data: { variation: 2 } },
  ],
};
fileContents[path2.replace(".hbs", ".json")] = {
  data: { component: "component2" },
};
fileContents[path3.replace(".hbs", ".json")] = {
  variations: [
    { name: "variation1", data: { variation: 1 } },
    { name: "variation2", data: { variation: 2 } },
  ],
};
fileContents[path6.replace(".hbs", ".json")] = {
  variations: [
    {
      name: "variation1",
      data: {},
    },
  ],
};
fileContents[path7.replace(".hbs", ".json")] = {
  variations: [{}, { name: "foo" }],
};
fileContents[path8.replace(".hbs", ".json")] = {
  variations: [
    {
      name: "variation1",
    },
  ],
};
fileContents[path9.replace(".hbs", ".json")] = {
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
      "component1.hbs": path1,
      "component2.hbs": path2,
      "component3.hbs": path3,
      "component4.hbs": path4,
      "component6.hbs": path6,
      "component7.hbs": path7,
      "component8.hbs": path8,
    },
    fileContents,
  });
  app.set("views", [path.join(process.cwd(), "/tests/mocks/srcFolder/")]);
  app.set("config", {
    extension: "hbs",
    srcFolder: "tests/mocks/srcFolder/",
    projectName: userProjectName,
    validations: {
      accessibility: true,
      html: true,
    },
  });

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
        isComponentOverview: true,
        tests,
        projectName,
        userProjectName,
        headmanDev: false,
        headmanProd: true,
        isBuild: false,
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
          isComponentOverview: false,
          tests,
          projectName,
          userProjectName,
          headmanDev: false,
          headmanProd: true,
          isBuild: false,
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
          isComponentOverview: true,
          tests,
          projectName,
          userProjectName,
          headmanDev: false,
          headmanProd: true,
          isBuild: false,
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
          isComponentOverview: false,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false,
          headmanDev: false,
          headmanProd: true,
          isBuild: false,
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
          isComponentOverview: false,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false,
          headmanDev: false,
          headmanProd: true,
          isBuild: false,
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
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: false,
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
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: false,
        });

        done();
      });
    });

    describe("without variation", () => {
      test("renders component.hbs", async (done) => {
        res.render = jest.fn();

        await render.renderComponent({ app, res, file: "component2" });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "component2\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: false,
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
          file: "component8.hbs",
          variation: "variation1",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: "component8\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: false,
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
          file: "component5",
          variation: "component5",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          html: '<p class="HeadmanError">Component couldn\'t be rendered.</p>',
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: false,
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
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: false,
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
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: false,
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
          file: "component1.hbs",
          embedded: true,
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variations.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          variations: [
            {
              file: "component1.hbs",
              html: "component1global\n",
              variation: "default",
              url:
                "/component?file=component1.hbs&variation=default&embedded=true",
            },
            {
              file: "component1.hbs",
              html: "component11global\n",
              variation: "variation1",
              url:
                "/component?file=component1.hbs&variation=variation1&embedded=true",
            },
            {
              file: "component1.hbs",
              html: "component12global\n",
              variation: "variation2",
              url:
                "/component?file=component1.hbs&variation=variation2&embedded=true",
            },
          ],
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          folder: "",
          projectName,
          userProjectName,
          isBuild: false,
          schema: [],
          name: "component1",
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
                file: "component1.hbs",
                html: "component1\n",
                variation: "default",
                url:
                  "/component?file=component1.hbs&variation=default&embedded=true",
              },
              {
                file: "component1.hbs",
                html: "component11\n",
                variation: "variation1",
                url:
                  "/component?file=component1.hbs&variation=variation1&embedded=true",
              },
              {
                file: "component1.hbs",
                html: "component12\n",
                variation: "variation2",
                url:
                  "/component?file=component1.hbs&variation=variation2&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "",
            projectName,
            userProjectName,
            isBuild: false,
            schema: [],
            name: "component1",
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
            file: "component3.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component3.hbs",
                html: "component31\n",
                variation: "variation1",
                url:
                  "/component?file=component3.hbs&variation=variation1&embedded=true",
              },
              {
                file: "component3.hbs",
                html: "component32\n",
                variation: "variation2",
                url:
                  "/component?file=component3.hbs&variation=variation2&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "",
            projectName,
            userProjectName,
            isBuild: false,
            documentation: undefined,
            theme: undefined,
            schema: [],
            name: "component3",
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
            file: "component6.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component6.hbs",
                html:
                  '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>',
                variation: "variation1",
                url:
                  "/component?file=component6.hbs&variation=variation1&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "",
            projectName,
            userProjectName,
            isBuild: false,
            documentation: undefined,
            theme: undefined,
            schema: [],
            name: "component6",
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
            file: "component7.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component7.hbs",
                html: "component7\n",
                variation: "foo",
                url:
                  "/component?file=component7.hbs&variation=foo&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "",
            projectName,
            userProjectName,
            isBuild: false,
            documentation: undefined,
            theme: undefined,
            schema: [],
            name: "component7",
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
            file: "component9.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            variations: [
              {
                file: "component9.hbs",
                html: "component9\n",
                variation: "default",
                url:
                  "/component?file=component9.hbs&variation=default&embedded=true",
              },
              {
                file: "component9.hbs",
                html: "component9\n",
                variation: "variation1",
                url:
                  "/component?file=component9.hbs&variation=variation1&embedded=true",
              },
            ],
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            folder: "",
            projectName,
            userProjectName,
            isBuild: false,
            schema: [],
            name: "component9",
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
            file: "component2.hbs",
            embedded: true,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            a11yTestsPreload: true,
            folder: "",
            documentation: undefined,
            theme: undefined,
            dev: false,
            prod: false,
            projectName,
            userProjectName,
            isBuild: false,
            schema: [],
            name: "component2",
            variations: [
              {
                file: "component2.hbs",
                html: "component2\n",
                url:
                  "/component?file=component2.hbs&variation=default&embedded=true",
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
            file: "component2.hbs",
            embedded: false,
          });

          expect(res.render.mock.calls[0][0]).toEqual(
            "component_variations.hbs"
          );
          expect(res.render.mock.calls[0][1]).toEqual({
            documentation: undefined,
            a11yTestsPreload: true,
            folder: "",
            theme: undefined,
            dev: false,
            prod: false,
            projectName,
            userProjectName,
            isBuild: false,
            schema: [],
            name: "component2",
            variations: [
              {
                file: "component2.hbs",
                html: "component2\n",
                url:
                  "/component?file=component2.hbs&variation=default&embedded=true",
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
          file: "component4.hbs",
        });

        expect(res.render.mock.calls[0][0]).toEqual("component_variations.hbs");
        expect(res.render.mock.calls[0][1]).toEqual({
          a11yTestsPreload: true,
          folder: "",
          documentation: undefined,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          isBuild: false,
          theme: undefined,
          variations: [
            {
              file: "component4.hbs",
              html: "component4\n",
              url:
                "/component?file=component4.hbs&variation=default&embedded=true",
              variation: "default",
            },
          ],
          schema: [],
          name: "component4",
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
              name: "component1",
              folders: [],
              html: "component1global\n",
              url: "/component?file=component1.hbs&embedded=true",
            },
            {
              name: "component2",
              folders: [],
              html: "component2\n",
              url: "/component?file=component2.hbs&embedded=true",
            },
            {
              name: "component3",
              folders: [],
              html: "component31\n",
              url: "/component?file=component3.hbs&embedded=true",
            },
            {
              name: "component4",
              folders: [],
              html: "component4\n",
              url: "/component?file=component4.hbs&embedded=true",
            },
            {
              name: "component6",
              folders: [],
              html:
                '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>',
              url: "/component?file=component6.hbs&embedded=true",
            },
            {
              name: "component7",
              folders: [],
              html: "component7\n",
              url: "/component?file=component7.hbs&embedded=true",
            },
            {
              name: "component8",
              folders: [],
              html: "component8\n",
              url: "/component?file=component8.hbs&embedded=true",
            },
          ],
          theme: undefined,
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName,
          isBuild: false,
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
              name: "component1",
              folders: [],
              html: "component1\n",
              url: "/component?file=component1.hbs&embedded=true",
            },
            {
              name: "component2",
              folders: [],
              html: "component2\n",
              url: "/component?file=component2.hbs&embedded=true",
            },
            {
              name: "component3",
              folders: [],
              html: "component31\n",
              url: "/component?file=component3.hbs&embedded=true",
            },
            {
              name: "component4",
              folders: [],
              html: "component4\n",
              url: "/component?file=component4.hbs&embedded=true",
            },
            {
              name: "component6",
              folders: [],
              html:
                '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>',
              url: "/component?file=component6.hbs&embedded=true",
            },
            {
              name: "component7",
              folders: [],
              html: "component7\n",
              url: "/component?file=component7.hbs&embedded=true",
            },
            {
              name: "component8",
              folders: [],
              html: "component8\n",
              url: "/component?file=component8.hbs&embedded=true",
            },
          ],
          theme: undefined,
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName,
          isBuild: false,
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
              name: "component1",
              html: "component1\n",
              url: "/component?file=component1.hbs&embedded=true",
              folders: [],
            },
            {
              name: "component2",
              html: "component2\n",
              url: "/component?file=component2.hbs&embedded=true",
              folders: [],
            },
            {
              name: "component3",
              html: "component31\n",
              url: "/component?file=component3.hbs&embedded=true",
              folders: [],
            },
            {
              name: "component4",
              html: "component4\n",
              url: "/component?file=component4.hbs&embedded=true",
              folders: [],
            },
            {
              name: "component6",
              html:
                '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>',
              url: "/component?file=component6.hbs&embedded=true",
              folders: [],
            },
            {
              name: "component7",
              html: "component7\n",
              url: "/component?file=component7.hbs&embedded=true",
              folders: [],
            },
            {
              name: "component8",
              html: "component8\n",
              url: "/component?file=component8.hbs&embedded=true",
              folders: [],
            },
          ],
          theme: undefined,
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName,
          isBuild: false,
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
          isBuild: false,
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
          isBuild: false,
        });

        done();
      });
    });
  });
});
