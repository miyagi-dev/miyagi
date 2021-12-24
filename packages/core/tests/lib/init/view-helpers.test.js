import deepMerge from "deepmerge";
import express from "express";
import config from "../../../lib/miyagi-config.js";

jest.mock("../../../lib/render/menu/index.js", () => {
  return {
    render: jest.fn(() => "menuHtml"),
  };
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/init/view-helpers", () => {
  describe("", () => {
    test("calls handlebars.registerHelper with menu", async () => {
      const handlebars = await import("handlebars");
      const viewHelpers = await import("../../../lib/init/view-helpers.js");
      const app = express();
      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          assets: {
            css: ["index.css"],
            js: [
              { src: "index.js", position: "head" },
              { src: "body.js", position: "body" },
            ],
          },
        })
      );
      handlebars.registerHelper = jest.fn();
      viewHelpers.default(app);

      expect(handlebars.registerHelper.mock.calls[0][0]).toEqual("menu");
      expect(typeof handlebars.registerHelper.mock.calls[0][1]).toEqual(
        "function"
      );
    });

    test("calls handlebars.registerHelper with cssFiles", async () => {
      const handlebars = await import("handlebars");
      const viewHelpers = await import("../../../lib/init/view-helpers.js");
      const app = express();
      app.set("config", {
        assets: {
          css: ["index.css"],
          js: [],
        },
      });

      handlebars.registerHelper = jest.fn();

      viewHelpers.default(app);

      expect(handlebars.registerHelper.mock.calls[1][0]).toEqual("cssFiles");
    });

    describe("calls handlebars.registerHelper with jsFiles", () => {
      test("with type=module", async () => {
        const handlebars = await import("handlebars");
        const app = express();
        app.set("config", {
          assets: {
            css: ["index.css"],
            js: [
              { src: "index.js", type: "module", position: "head" },
              { src: "body.js", type: "module", position: "body" },
            ],
          },
        });

        const viewHelpers = await import("../../../lib/init/view-helpers.js");

        handlebars.registerHelper = jest.fn();
        viewHelpers.default(app);

        expect(handlebars.registerHelper.mock.calls[2][0]).toEqual(
          "jsFilesHead"
        );
        expect(handlebars.registerHelper.mock.calls[2][1]).toEqual(
          '<script src="index.js" type="module"></script>'
        );
        expect(handlebars.registerHelper.mock.calls[3][0]).toEqual(
          "jsFilesBody"
        );
        expect(handlebars.registerHelper.mock.calls[3][1]).toEqual(
          '<script src="body.js" type="module"></script>'
        );
      });

      test("without type=module", async () => {
        const handlebars = await import("handlebars");
        const app = express();
        const viewHelpers = await import("../../../lib/init/view-helpers.js");

        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            assets: {
              css: ["index.css"],
              js: [
                { src: "index.js", position: "head" },
                { src: "body.js", position: "body" },
              ],
            },
          })
        );

        handlebars.registerHelper = jest.fn();

        viewHelpers.default(app);

        expect(handlebars.registerHelper.mock.calls[2][0]).toEqual(
          "jsFilesHead"
        );
        expect(handlebars.registerHelper.mock.calls[2][1]).toEqual(
          '<script src="index.js"></script>'
        );
        expect(handlebars.registerHelper.mock.calls[3][0]).toEqual(
          "jsFilesBody"
        );
        expect(handlebars.registerHelper.mock.calls[3][1]).toEqual(
          '<script src="body.js"></script>'
        );
      });
    });
  });

  describe("menu", () => {
    test("returns the result from render/menu/index", async () => {
      const handlebars = await import("handlebars");
      const app = express();
      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          assets: {
            css: ["index.css"],
            js: [{ src: "index.js" }],
          },
        })
      );
      const viewHelpers = await import("../../../lib/init/view-helpers.js");

      viewHelpers.default(app);

      const template = handlebars.compile("{{#menu}}{{/menu}}");

      expect(template()).toEqual("menuHtml");
    });
  });
});
