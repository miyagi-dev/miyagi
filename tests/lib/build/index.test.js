import build from "../../../lib/build/";
import render from "../../../lib/render/index.js";
import logger from "../../../lib/logger.js";
import fs from "fs-extra";
import path from "path";
import express from "express";

jest.mock("fs-extra", () => {
  return {
    emptyDir: jest.fn((path, cb) => cb()),
    writeFile: jest.fn(),
    copy: jest.fn()
  };
});

jest.mock("../../../lib/render/index.js", () => {
  return {
    renderComponent: jest.fn(() => {
      return new Promise(resolve => resolve);
    }),
    renderComponentOverview: jest.fn(() => {
      return new Promise(resolve => resolve);
    }),
    renderComponentVariations: jest.fn(() => {
      return new Promise(resolve => resolve);
    }),
    renderMain: jest.fn(() => {
      return new Promise(resolve => resolve);
    }),
    renderMainWithComponent: jest.fn(() => {
      return new Promise(resolve => resolve);
    })
  };
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/build/index", () => {
  const app = express();
  const data = {};

  data["/headman/tests/srcFolder/foo/bar.json"] = {
    variations: [
      {
        name: 1
      },
      {
        name: 2
      }
    ]
  };

  process.cwd = () => "/headman/tests";

  app.set("config", {
    buildFolder: "buildFolder",
    srcFolder: "srcFolder/",
    extension: "hbs",
    cssFiles: ["index.css"],
    jsFiles: ["index.js"]
  });
  app.set("state", {
    partials: {
      "foo/bar.hbs": "/headman/tests/srcFolder/foo/bar.hbs"
    },
    data
  });

  describe("build()", () => {
    test("calls fs.emptyDir with the build folder path", async done => {
      const spyComponentOverview = jest.spyOn(
        render,
        "renderComponentOverview"
      );
      const spyComponent = jest.spyOn(render, "renderComponent");
      const spyComponentVariations = jest.spyOn(
        render,
        "renderComponentVariations"
      );
      const spyMainWithComponent = jest.spyOn(
        render,
        "renderMainWithComponent"
      );
      const spyMain = jest.spyOn(render, "renderMain");

      await build(app);

      expect(fs.emptyDir.mock.calls[0][0]).toEqual(
        path.resolve("buildFolder/")
      );
      expect(typeof fs.emptyDir.mock.calls[0][1]).toEqual("function");

      // buildDistDirectory
      expect(fs.copy.mock.calls[0][0]).toEqual(
        path.join(__dirname, "../../../dist/")
      );
      expect(fs.copy.mock.calls[0][1]).toEqual("buildFolder/headman/");
      expect(typeof fs.copy.mock.calls[0][2]).toEqual("function");

      // buildUserAssets
      expect(fs.copy.mock.calls[1][0]).toEqual(path.resolve("index.css"));
      expect(fs.copy.mock.calls[1][1]).toEqual("buildFolder/index.css");
      expect(typeof fs.copy.mock.calls[1][2]).toEqual("function");
      expect(fs.copy.mock.calls[2][0]).toEqual(path.resolve("index.js"));
      expect(fs.copy.mock.calls[2][1]).toEqual("buildFolder/index.js");
      expect(typeof fs.copy.mock.calls[2][2]).toEqual("function");

      expect(spyComponentOverview).toHaveBeenCalledTimes(2);
      expect(spyComponent).toHaveBeenCalledTimes(6);
      expect(spyComponentVariations).toHaveBeenCalledTimes(2);
      expect(spyMainWithComponent).toHaveBeenCalledTimes(4);
      expect(spyMain).toHaveBeenCalled();

      done();
    });
  });
});
