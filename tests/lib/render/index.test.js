const render = require("../../../lib/render/index.js");
const tests = require("../../../lib/render/tests.json");
const config = require("../../mocks/config.json");
const express = require("express");
const engines = require("consolidate");
const path = require("path");

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/render/index", () => {
  const component = "component";
  const path1 = `${path.join(
    process.cwd(),
    "/tests/mocks/srcFolder/component1.hbs"
  )}`;
  const path2 = `${path.join(
    process.cwd(),
    "/tests/mocks/srcFolder/component2.hbs"
  )}`;
  const variation = "variation";
  const menu = "menu";
  const userProjectName = "projectName";
  const app = express();
  const data = {};

  data[path1] = {
    data: { component: "component1" }
  };
  data[path2] = {
    data: { component: "component2" }
  };

  app.engine("hbs", engines.handlebars);
  app.set("view engine", "hbs");

  app.set("state", {
    menu,
    partials: {
      "component1.hbs": path1,
      "component2.hbs": path2
    },
    data
  });
  app.set("views", [path.join(process.cwd(), "tests/mocks/srcFolder/")]);
  app.set("config", {
    srcFolder: "",
    projectName: userProjectName,
    validations: {
      accessibility: true,
      html: true
    }
  });

  const req = {
    app
  };

  const res = {
    render: jest.fn()
  };

  const projectName = config.projectName;
  const folders = menu;

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
    describe("component doesn't have variations", () => {
      describe("embedded=true", () => {
        test("renders component_frame.hbs", () => {});
      });

      describe("embedded=false", () => {
        test("renders component.hbs", () => {});
      });
    });
  });

  describe("renderComponentVariations", () => {
    describe("component has variations", () => {
      test("renders component_variations.hbs", () => {});
    });

    describe("component doesn't have variations", () => {
      describe("embedded=true", () => {
        test("renders component_frame.hbs", () => {});
      });

      describe("embedded=false", () => {
        test("renders component.hbs", () => {});
      });
    });
  });

  describe("renderComponentOverview", () => {
    describe("embedded=true", () => {
      test.only("renders component_overview.hbs", async done => {
        const spy = jest.spyOn(res, "render");

        await render.renderComponentOverview(req, res, true);

        expect(spy).toHaveBeenCalledWith("component_overview.hbs", {
          components: [
            { file: "component1.hbs", html: "component1\n" },
            { file: "component2.hbs", html: "component2\n" }
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
            { file: "tests/component1.hbs", html: "component1" },
            { file: "tests/component2.hbs", html: "component2" }
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
          html: `<p class="FreitagError">${component} not found.</p>`,
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
          html: `<p class="FreitagError">${component} not found.</p>`,
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
