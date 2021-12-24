import express from "express";
import deepMerge from "deepmerge";
import structureJson from "../../../mock-data/structure.json";
import dataJson from "../../../mock-data/data.json";
import sourceTreeJson from "../../../mock-data/source-tree.json";
import config from "../../../../lib/miyagi-config.js";

jest.mock("../../../../lib/logger");

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/menu/structure", () => {
  test("returns the updated source structure for the menu", async () => {
    const app = express();
    app.set(
      "config",
      deepMerge(config.defaultUserConfig, {
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
      sourceTree: sourceTreeJson,
      fileContents: dataJson,
    });

    process.cwd = () => "/miyagi/tests";

    const structure = await import("../../../../lib/state/menu/structure.js");
    return await expect(structure.default(app)).toEqual(structureJson);
  });

  describe("with no result", () => {
    test("it returns an empty array", async () => {
      const app = express();
      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
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
        fileContents: dataJson,
      });

      const structure = await import("../../../../lib/state/menu/structure.js");
      expect(structure.default(app)).toEqual([]);
    });
  });
});
