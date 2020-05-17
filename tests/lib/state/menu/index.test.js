const menuJson = require("../../../mocks/menu.json");
const config = require("../../../../lib/config.json");
const express = require("express");
const deepMerge = require("deepmerge");

jest.mock("../../../../lib/state/menu/structure.js", () => {
  return () => {
    return require("../../../mocks/structure.json");
  };
});

jest.mock("process", () => {
  return {
    cwd: () => "/headman/tests",
  };
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("state/menu/index", () => {
  test("returns the structure for the menu", async (done) => {
    const app = express();
    app.set(
      "config",
      deepMerge(config.defaultUserConfig, {
        files: {
          templates: {
            extension: "hbs",
            engine: "handlebars",
          },
        },
        components: {
          folder: "/",
        },
      })
    );
    app.set("state", {
      sourceTree: {},
      fileContents: {},
    });

    const { getMenu } = require("../../../../lib/state/menu");
    await expect(getMenu(app)).toEqual(menuJson);
    done();
  });
});
