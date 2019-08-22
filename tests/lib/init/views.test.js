const setViews = require("../../../lib/init/views.js");
const express = require("express");
const path = require("path");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/init/views", () => {
  const app = express();
  app.set("config", {
    srcFolder: "src/"
  });

  setViews(app);

  test("adds the internal views folder to the app instance", () => {
    expect(app.get("views")).toContain(
      path.join(__dirname, "../../../lib/views")
    );
  });

  test("adds the user srcFolder to the app instance", () => {
    expect(app.get("views")).toContain(
      path.resolve(app.get("config").srcFolder)
    );
  });

  test("adds exactly two views folders app instance", () => {
    expect(app.get("views").length).toBe(2);
  });
});
