import express from "express";
import path from "path";
import deepMerge from "deepmerge";
import config from "../../../lib/miyagi-config.js";
import {
  getFallbackData,
  getDataForRenderFunction,
} from "../../../lib/render/helpers.js";

describe("lib/render/helpers", () => {
  describe("getFallbackData()", () => {
    describe("with data in variations", () => {
      test("returns the data of the first variation with data", () => {
        const variations = [
          {},
          {
            val: 2,
          },
          {
            val: 3,
          },
        ];

        expect(getFallbackData(variations)).toEqual({ val: 2 });
      });
    });

    describe("without data in variations", () => {
      test("returns {}", () => {
        const variations = [{}, {}, {}];

        expect(getFallbackData(variations)).toEqual({});
      });
    });
  });

  describe("getDataForRenderFunction()", () => {
    test("it sets engine specific keys on the given object", () => {
      const app = express();
      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          components: {
            folder: "srcFolder",
          },
          files: { templates: {} },
        })
      );
      app.set("state", {
        partials: "partials",
      });
      const fullPath = path.join(process.cwd(), "srcFolder");

      expect(
        getDataForRenderFunction(app, {
          foo: "bar",
        })
      ).toEqual({
        path: fullPath,
        foo: "bar",
        partials: "partials",
        basedir: fullPath,
        root: fullPath,
        settings: {
          views: fullPath,
        },
      });
    });
  });
});
