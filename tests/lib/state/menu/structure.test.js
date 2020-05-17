const structureJson = require("../../../mocks/structure.json");
const dataJson = require("../../../mocks/data.json");
const sourceTreeJson = require("../../../mocks/source-tree.json");
const logger = require("../../../../lib/logger.js");
const config = require("../../../../lib/config.json");
const express = require("express");
const deepMerge = require("deepmerge");

logger.log = jest.fn();

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/menu/structure", () => {
  test("returns the updated source structure for the menu", async (done) => {
    const app = express();
    app.set(
      "config",
      deepMerge(config.defaultUserConfig, {
        files: {
          templates: {
            extension: "hbs",
          },
        },
        srcFolder: "src/",
      })
    );
    app.set("state", {
      sourceTree: sourceTreeJson,
      fileContents: dataJson,
    });

    process.cwd = () => "/headman/tests";

    const structure = require("../../../../lib/state/menu/structure.js");
    await expect(structure(app)).toEqual(structureJson);
    done();
  });

  describe("with no result", () => {
    test("it returns an empty array", () => {
      const app = express();
      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          files: {
            templates: {
              extension: "hbs",
            },
          },
          srcFolder: "src/",
        })
      );
      app.set("state", {
        sourceTree: {},
        fileContents: dataJson,
      });

      const structure = require("../../../../lib/state/menu/structure.js");
      expect(structure(app)).toEqual([]);
    });
  });
});
