import deepMerge from "deepmerge";
import fs from "fs-extra";
import path from "path";
import express from "express";
import config from "../../../lib/config.json";
import build from "../../../lib/build";
import render from "../../../lib/render/index";

jest.mock("fs-extra", () => {
  return {
    emptyDir: jest.fn((p, cb) => cb()),
    writeFile: jest.fn(),
    copy: jest.fn(),
  };
});

jest.mock("../../../lib/render/index.js", () => {
  return {
    renderIframeVariation: jest.fn(() => {
      return new Promise((resolve) => resolve);
    }),
    renderIframeIndex: jest.fn(() => {
      return new Promise((resolve) => resolve);
    }),
    renderIframeComponent: jest.fn(() => {
      return new Promise((resolve) => resolve);
    }),
    renderMainIndex: jest.fn(() => {
      return new Promise((resolve) => resolve);
    }),
    renderMainComponent: jest.fn(() => {
      return new Promise((resolve) => resolve);
    }),
  };
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/build/index", () => {
  const app = express();
  const fileContents = {};

  fileContents["/miyagi/tests/srcFolder/foo/mocks.json"] = {
    $variants: [
      {
        $name: 1,
      },
      {
        $name: 2,
      },
    ],
  };

  process.cwd = () => "/miyagi/tests";

  app.set(
    "config",
    deepMerge(config.defaultUserConfig, {
      build: {
        folder: "buildFolder",
      },
      components: {
        folder: "srcFolder",
      },
      files: {
        templates: {
          extension: "hbs",
        },
      },
      assets: {
        css: ["index.css"],
        js: ["index.js"],
      },
      theme: {
        mode: "light",
      },
    })
  );
  app.set("state", {
    partials: {
      "foo/index.hbs": "/miyagi/tests/srcFolder/foo/index.hbs",
    },
    fileContents,
  });

  describe("build()", () => {
    test("calls fs.emptyDir with the build folder path", async (done) => {
      const spyComponentOverview = jest.spyOn(render, "renderIframeIndex");
      const spyComponent = jest.spyOn(render, "renderIframeVariation");
      const spyComponentVariations = jest.spyOn(
        render,
        "renderIframeComponent"
      );
      const spyMainWithComponent = jest.spyOn(render, "renderMainComponent");
      const spyMain = jest.spyOn(render, "renderMainIndex");

      await build(app);

      expect(fs.emptyDir.mock.calls[0][0]).toEqual(
        path.resolve("buildFolder/")
      );
      expect(typeof fs.emptyDir.mock.calls[0][1]).toEqual("function");

      // buildDistDirectory
      expect(fs.copy.mock.calls[0][0]).toEqual(
        path.join(__dirname, "../../../dist/")
      );
      expect(fs.copy.mock.calls[0][1]).toEqual("buildFolder/miyagi/");
      expect(typeof fs.copy.mock.calls[0][2]).toEqual("function");

      // buildUserAssets
      expect(fs.copy.mock.calls[1][0]).toEqual(path.resolve("index.css"));
      expect(fs.copy.mock.calls[1][1]).toEqual("buildFolder/index.css");
      expect(typeof fs.copy.mock.calls[1][2]).toEqual("function");
      expect(fs.copy.mock.calls[2][0]).toEqual(path.resolve("index.js"));
      expect(fs.copy.mock.calls[2][1]).toEqual("buildFolder/index.js");
      expect(typeof fs.copy.mock.calls[2][2]).toEqual("function");

      expect(spyComponentOverview).toHaveBeenCalledTimes(2);
      expect(spyComponent).toHaveBeenCalledTimes(4);
      expect(spyComponentVariations).toHaveBeenCalledTimes(2);
      expect(spyMainWithComponent).toHaveBeenCalledTimes(3);
      expect(spyMain).toHaveBeenCalled();

      done();
    });
  });
});
