import express from "express";
import path from "path";
import deepMerge from "deepmerge";
import setViews from "../../../lib/init/views.js";
import config from "../../../lib/miyagi-config.js";

jest.mock("../../../lib/__dirname.js", () => `${process.cwd()}/lib`);

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/init/views", () => {
  const app = express();
  app.set(
    "config",
    deepMerge(config.defaultUserConfig, {
      components: {
        folder: "src",
      },
    })
  );

  setViews(app);

  test("adds the internal views folder to the app instance", () => {
    expect(app.get("views")).toContain(
      path.join(__dirname, "../../../lib/views")
    );
  });

  test("adds the user components.folder to the app instance", () => {
    expect(app.get("views")).toContain(
      path.resolve(app.get("config").components.folder)
    );
  });

  test("adds exactly two views folders app instance", () => {
    expect(app.get("views").length).toBe(2);
  });
});
