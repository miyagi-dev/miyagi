const structureJson = require("../../../mocks/structure.json");
const dataJson = require("../../../mocks/data.json");
const sourceTreeJson = require("../../../mocks/source-tree.json");
const logger = require("../../../../lib/logger.js");
const express = require("express");

logger.log = jest.fn();

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/menu/structure", () => {
  test("returns the updated source structure for the menu", async done => {
    const app = express();
    app.set("config", {
      extension: "hbs",
      srcFolder: ""
    });
    app.set("state", {
      sourceTree: sourceTreeJson,
      data: dataJson
    });

    process.cwd = () => "/freitag/tests";

    const structure = require("../../../../lib/state/menu/structure.js");
    await expect(structure(app)).toEqual(structureJson);
    done();
  });

  describe("with no result", () => {
    test("it returns an empty array", () => {
      const app = express();
      app.set("config", {
        extension: "hbs",
        srcFolder: ""
      });
      app.set("state", {
        sourceTree: {},
        data: dataJson
      });

      const structure = require("../../../../lib/state/menu/structure.js");
      expect(structure(app)).toEqual([]);
    });
  });
});
