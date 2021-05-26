const express = require("express");
const deepMerge = require("deepmerge");
const menuJson = require("../../../mocks/menu.json");
const config = require("../../../../lib/config.json");

jest.mock("../../../../lib/state/menu/structure.js", () => {
  return () => {
    return require("../../../mocks/structure.json");
  };
});

process.cwd = () => "/miyagi/tests";

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("state/menu/index", () => {
  test("returns the structure for the menu", async () => {
    const app = express();
    app.set(
      "config",
      deepMerge(config.defaultUserConfig, {
        engine: {
          name: "handlebars",
        },
        files: {
          templates: {
            extension: "hbs",
          },
        },
        components: {
          folder: "src",
        },
      })
    );
    app.set("state", {
      sourceTree: {},
      fileContents: {},
    });

    const { getMenu } = require("../../../../lib/state/menu");
    return await expect(getMenu(app)).toEqual(menuJson);
  });
});
