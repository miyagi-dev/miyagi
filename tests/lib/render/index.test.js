const render = require("../../../lib/render/index.js");
const tests = require("../../../lib/render/tests.json");
const config = require("../../mocks/config.json");
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
const data = {};

data[path1.replace(".hbs", ".json")] = {
  data: {
    component: "component1"
  },
  variations: [
    { name: "variation1", data: { variation: 1 } },
    { name: "variation2", data: { variation: 2 } }
  ]
};
data[path2.replace(".hbs", ".json")] = {
  data: { component: "component2" }
};
data[path3.replace(".hbs", ".json")] = {
  variations: [
    { name: "variation1", data: { variation: 1 } },
    { name: "variation2", data: { variation: 2 } }
  ]
};
data[path6.replace(".hbs", ".json")] = {
  variations: [
    {
      name: "variation1",
      data: {}
    }
  ]
};
data[path7.replace(".hbs", ".json")] = {
  variations: [{}]
};
data[path8.replace(".hbs", ".json")] = {
  variations: [
    {
      name: "variation1"
    }
  ]
};
data[path9.replace(".hbs", ".json")] = {
  data: {},
  variations: [
    {
      name: "variation1"
    }
  ]
};
const projectName = config.projectName;
const folders = menu;

let app;
let req;
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
      "component8.hbs": path8
    },
    data
  });
  app.set("views", [path.join(process.cwd(), "/tests/mocks/srcFolder/")]);
  app.set("config", {
    extension: "hbs",
    srcFolder: "tests/mocks/srcFolder/",
    projectName: userProjectName,
    validations: {
      accessibility: true,
      html: true
    }
  });

  req = {
    app
  };

  res = {
    render: jest.fn()
  };
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/render/index", () => {
  describe("renderMain", () => {
    test("renders index.hbs", async done => {
      const spy = jest.spyOn(res, "render");

      await render.renderMain(req, res);

      expect(spy).toHaveBeenCalledWith("index.hbs", {
        folders,
        iframeSrc: "/component?file=all&embedded=true",
        showAll: true,
        isComponentOverview: true,
        tests,
        projectName,
        userProjectName
      });

      done();
    });
  });

  describe("renderMainWithComponent", () => {
    describe("with variation", () => {
      test("renders index.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderMainWithComponent(req, res, component, variation);

        expect(spy).toHaveBeenCalledWith("index.hbs", {
          folders,
          iframeSrc: `/component?file=${component}&variation=${variation}&embedded=true`,
          requestedComponent: component,
          requestedVariation: variation,
          isComponentOverview: false,
          tests,
          projectName,
          userProjectName
        });

        done();
      });
    });

    describe("without variation", () => {
      test("renders index.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderMainWithComponent(req, res, component);

        expect(spy).toHaveBeenCalledWith("index.hbs", {
          folders,
          iframeSrc: `/component?file=${component}&embedded=true`,
          requestedComponent: component,
          requestedVariation: undefined,
          isComponentOverview: true,
          tests,
          projectName,
          userProjectName
        });

        done();
      });
    });
  });

  describe("renderMainWith404", () => {
    describe("with variation", () => {
      test("renders index.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderMainWith404(req, res, component, variation);

        expect(spy).toHaveBeenCalledWith("index.hbs", {
          folders,
          iframeSrc: `/component?file=${component}&variation=${variation}&embedded=true`,
          requestedComponent: null,
          requestedVariation: null,
          isComponentOverview: false,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false
        });

        done();
      });
    });

    describe("without variation", () => {
      test("renders index.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderMainWith404(req, res, component);

        expect(spy).toHaveBeenCalledWith("index.hbs", {
          folders,
          iframeSrc: `/component?file=${component}&embedded=true`,
          requestedComponent: null,
          requestedVariation: null,
          isComponentOverview: false,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false
        });

        done();
      });
    });
  });

  describe("renderComponent", () => {
    describe("with variation", () => {
      test("renders component.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponent(req, res, component, "variation1");

        expect(spy).toHaveBeenCalledWith("component.hbs", {
          html: "component11\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName
        });

        done();
      });
    });

    describe("without variation", () => {
      test("renders component.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponent(req, res, "component2");

        expect(spy).toHaveBeenCalledWith("component.hbs", {
          html: "component2\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName
        });

        done();
      });
    });

    describe("with variation not having a data key", () => {
      test("renders component.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponent(req, res, "component8.hbs", "variation1");

        expect(spy).toHaveBeenCalledWith("component.hbs", {
          html: "component8\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName
        });

        done();
      });
    });

    describe("rendering throwing an error", () => {
      test("renders component.hbs with error", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponent(req, res, "component5", "component5");

        expect(spy).toHaveBeenCalledWith("component.hbs", {
          html: '<p class="HeadmanError">Component couldn\'t be rendered.</p>',
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName
        });

        done();
      });
    });

    describe("embedded=true", () => {
      test("renders component_frame.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponent(req, res, component, "component1", true);

        expect(spy).toHaveBeenCalledWith("component_frame.hbs", {
          html: "component1\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: `/component?file=${component}&variation=component1`,
          dev: false,
          prod: false,
          projectName,
          userProjectName
        });

        done();
      });
    });

    describe("embedded=false", () => {
      test("renders component.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponent(req, res, component, null, false);

        await expect(await spy).toHaveBeenCalledWith("component.hbs", {
          html: "component1\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName
        });

        done();
      });
    });
  });

  describe("renderComponentVariations", () => {
    describe("component has variations", () => {
      describe("with data key", () => {
        test("renders component_variations.hbs", async done => {
          const spy = jest.spyOn(res, "render");

          await render.renderComponentVariations(req, res, component, true);

          expect(spy).toHaveBeenCalledWith("component_variations.hbs", {
            variations: [
              {
                file: "component1.hbs",
                html: "component1\n",
                variation: "component1"
              },
              {
                file: "component1.hbs",
                html: "component11\n",
                variation: "variation1"
              },
              {
                file: "component1.hbs",
                html: "component12\n",
                variation: "variation2"
              }
            ],
            standaloneUrl: `/component?file=${component}`,
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            projectName,
            userProjectName
          });

          done();
        });
      });

      describe("without data key", () => {
        test("renders component_variations.hbs", async done => {
          const spy = jest.spyOn(res, "render");

          await render.renderComponentVariations(
            req,
            res,
            "component3.hbs",
            true
          );

          expect(spy).toHaveBeenCalledWith("component_variations.hbs", {
            variations: [
              {
                file: "component3.hbs",
                html: "component31\n",
                variation: "variation1"
              },
              {
                file: "component3.hbs",
                html: "component32\n",
                variation: "variation2"
              }
            ],
            standaloneUrl: `/component?file=component3.hbs`,
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            projectName,
            userProjectName
          });

          done();
        });
      });

      describe("variation throws an error", () => {
        test("renders component_variations.hbs", async done => {
          const spy = jest.spyOn(res, "render");

          await render.renderComponentVariations(
            req,
            res,
            "component6.hbs",
            true
          );

          expect(spy).toHaveBeenCalledWith("component_variations.hbs", {
            variations: [
              {
                file: "component6.hbs",
                html:
                  '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>',
                variation: "variation1"
              }
            ],
            standaloneUrl: `/component?file=component6.hbs`,
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            projectName,
            userProjectName
          });

          done();
        });
      });

      describe("variation doesn't have a name", () => {
        test("renders component_variations.hbs", async done => {
          const spy = jest.spyOn(res, "render");

          await render.renderComponentVariations(
            req,
            res,
            "component7.hbs",
            true
          );

          expect(spy).toHaveBeenCalledWith("component_variations.hbs", {
            variations: [
              {
                file: "component7.hbs",
                html: "component7\n",
                variation: "component7"
              }
            ],
            standaloneUrl: `/component?file=component7.hbs`,
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            projectName,
            userProjectName
          });

          done();
        });
      });

      describe("component has data, but variation doesn't have data", () => {
        test("renders component_variations.hbs", async done => {
          const spy = jest.spyOn(res, "render");

          await render.renderComponentVariations(
            req,
            res,
            "component9.hbs",
            true
          );

          expect(spy).toHaveBeenCalledWith("component_variations.hbs", {
            variations: [
              {
                file: "component9.hbs",
                html: "component9\n",
                variation: "component9"
              },
              {
                file: "component9.hbs",
                html: "component9\n",
                variation: "variation1"
              }
            ],
            standaloneUrl: `/component?file=component9.hbs`,
            dev: false,
            prod: false,
            a11yTestsPreload: true,
            projectName,
            userProjectName
          });

          done();
        });
      });
    });

    describe("component doesn't have variations", () => {
      describe("embedded=true", () => {
        test("renders component_frame.hbs", async done => {
          const spy = jest.spyOn(res, "render");

          await render.renderComponentVariations(
            req,
            res,
            "component2.hbs",
            true
          );

          await expect(await spy).toHaveBeenCalledWith("component_frame.hbs", {
            html: "component2\n",
            htmlValidation: true,
            accessibilityValidation: true,
            standaloneUrl: `/component?file=component2.hbs`,
            dev: false,
            prod: false,
            projectName,
            userProjectName
          });

          done();
        });
      });

      describe("embedded=false", () => {
        test("renders component.hbs", async done => {
          const spy = jest.spyOn(res, "render");

          await render.renderComponentVariations(
            req,
            res,
            "component2.hbs",
            false
          );

          await expect(await spy).toHaveBeenCalledWith("component.hbs", {
            html: "component2\n",
            htmlValidation: true,
            accessibilityValidation: true,
            standaloneUrl: null,
            dev: false,
            prod: false,
            projectName,
            userProjectName
          });

          done();
        });
      });
    });

    describe("component doesn't have json data", () => {
      test("renders component.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponentVariations(req, res, "component4.hbs");

        await expect(await spy).toHaveBeenCalledWith("component.hbs", {
          html: "component4\n",
          htmlValidation: true,
          accessibilityValidation: true,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName
        });

        done();
      });
    });
  });

  describe("renderComponentOverview", () => {
    describe("embedded=true", () => {
      test("renders component_overview.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponentOverview(req, res, true);

        expect(spy).toHaveBeenCalledWith("component_overview.hbs", {
          components: [
            { file: "component1.hbs", html: "component1\n" },
            { file: "component2.hbs", html: "component2\n" },
            { file: "component3.hbs", html: "component31\n" },
            { file: "component4.hbs", html: "component4\n" },
            {
              file: "component6.hbs",
              html:
                '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>'
            },
            { file: "component7.hbs", html: "component7\n" },
            { file: "component8.hbs", html: "component8\n" }
          ],
          standaloneUrl: "/component?file=all",
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName
        });

        done();
      });
    });

    describe("embedded=false", () => {
      test("renders component_overview.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponentOverview(req, res, false);

        expect(spy).toHaveBeenCalledWith("component_overview.hbs", {
          components: [
            { file: "component1.hbs", html: "component1\n" },
            { file: "component2.hbs", html: "component2\n" },
            { file: "component3.hbs", html: "component31\n" },
            { file: "component4.hbs", html: "component4\n" },
            {
              file: "component6.hbs",
              html:
                '<p class="HeadmanError">Error: The partial doesntexist.hbs could not be found</p>'
            },
            { file: "component7.hbs", html: "component7\n" },
            { file: "component8.hbs", html: "component8\n" }
          ],
          standaloneUrl: null,
          dev: false,
          prod: false,
          a11yTestsPreload: true,
          projectName,
          userProjectName
        });

        done();
      });
    });
  });

  describe("renderComponentNotFound", () => {
    describe("embedded=true", () => {
      test("renders component_frame.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponentNotFound(req, res, true, component);

        expect(spy).toHaveBeenCalledWith("component_frame.hbs", {
          html: `<p class="HeadmanError">${component} not found.</p>`,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false
        });

        done();
      });
    });

    describe("embedded=false", () => {
      test("renders component.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponentNotFound(req, res, false, component);

        expect(spy).toHaveBeenCalledWith("component.hbs", {
          html: `<p class="HeadmanError">${component} not found.</p>`,
          standaloneUrl: null,
          dev: false,
          prod: false,
          projectName,
          userProjectName,
          htmlValidation: false,
          accessibilityValidation: false
        });

        done();
      });
    });
  });
});
