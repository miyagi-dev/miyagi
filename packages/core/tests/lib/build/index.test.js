import deepMerge from "deepmerge";
import fs from "fs";
import path from "path";
import express from "express";
import config from "../../../lib/config.json";
import build from "../../../lib/build";
import render from "../../../lib/render/index";

jest.mock("../../../lib/logger");

jest.mock("fs", () => ({
  rm: jest.fn((p, opts, cb) => cb()),
  mkdir: jest.fn((p, opts, cb) => cb()),
  cp: jest.fn((p, b, opts, cb) => cb()),
  writeFile: jest.fn((p, b, cb) => cb()),
  promises: {
    readdir: jest.fn().mockResolvedValue(),
  },
}));

jest.mock("../../../lib/render/index.js", () => {
  return {
    renderIframeVariation: jest.fn(({ cb }) => cb()),
    renderIframeIndex: jest.fn(({ cb }) => cb()),
    renderIframeComponent: jest.fn(({ cb }) => cb()),
    renderMainIndex: jest.fn(({ cb }) => cb()),
    renderMainComponent: jest.fn(({ cb }) => cb()),
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
    test("calls fs.rm with the build folder path", async () => {
      const spyComponentOverview = jest.spyOn(render, "renderIframeIndex");
      const spyComponent = jest.spyOn(render, "renderIframeVariation");
      const spyComponentVariations = jest.spyOn(
        render,
        "renderIframeComponent"
      );
      const spyMainWithComponent = jest.spyOn(render, "renderMainComponent");
      const spyMain = jest.spyOn(render, "renderMainIndex");

      await build(app);

      expect(fs.rm.mock.calls[0][0]).toEqual(path.resolve("buildFolder/"));
      expect(fs.rm.mock.calls[0][1]).toEqual({ recursive: true });
      expect(typeof fs.rm.mock.calls[0][2]).toEqual("function");

      // buildDistDirectory
      expect(fs.cp.mock.calls[0][0]).toEqual(
        path.join(__dirname, "../../../dist/")
      );
      expect(fs.cp.mock.calls[0][1]).toEqual("buildFolder/miyagi/");
      expect(fs.cp.mock.calls[0][2]).toEqual({ recursive: true });
      expect(typeof fs.cp.mock.calls[0][3]).toEqual("function");

      // buildUserAssets
      expect(fs.cp.mock.calls[1][0]).toEqual("index.css");
      expect(fs.cp.mock.calls[1][1]).toEqual("buildFolder/index.css");
      expect(fs.cp.mock.calls[1][2]).toEqual({ recursive: true });
      expect(typeof fs.cp.mock.calls[1][3]).toEqual("function");
      expect(fs.cp.mock.calls[2][0]).toEqual("index.js");
      expect(fs.cp.mock.calls[2][1]).toEqual("buildFolder/index.js");
      expect(fs.cp.mock.calls[2][2]).toEqual({ recursive: true });
      expect(typeof fs.cp.mock.calls[2][3]).toEqual("function");

      expect(spyComponentOverview).toHaveBeenCalledTimes(2);
      expect(spyComponent).toHaveBeenCalledTimes(4);
      expect(spyComponentVariations).toHaveBeenCalledTimes(2);
      expect(spyMainWithComponent).toHaveBeenCalledTimes(3);
      expect(spyMain).toHaveBeenCalled();
    });
  });
});
