import express from "express";
import deepMerge from "deepmerge";
import menuJson from "../../../mock-data/menu.json";
import config from "../../../../lib/miyagi-config.js";

jest.mock("../../../../lib/state/menu/structure.js", () => {
  return () => {
    return require("../../../mock-data/structure.json");
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

    const { getMenu } = await import("../../../../lib/state/menu");
    return await expect(getMenu(app)).toEqual(menuJson);
  });
});
