const menuJson = require("../../../mocks/menu.json");
const express = require("express");

jest.mock("../../../../lib/state/menu/structure.js", () => {
  return () => {
    return require("../../../mocks/structure.json");
  };
});

jest.mock("process", () => {
  return {
    cwd: () => "/freitag/tests"
  };
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("state/menu/index", () => {
  test("returns the structure for the menu", async done => {
    const app = express();
    app.set("config", {
      extension: "hbs",
      srcFolder: "/"
    });
    app.set("state", {
      sourceTree: {}
    });

    const { getMenu } = require("../../../../lib/state/menu/index.js");
    await expect(getMenu(app)).toEqual(menuJson);
    done();
  });
});
