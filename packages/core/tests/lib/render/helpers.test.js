const express = require("express");
const path = require("path");
const deepMerge = require("deepmerge");
const config = require("../../../lib/config.json");
const helpers = require("../../../lib/render/helpers.js");

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

        expect(helpers.getFallbackData(variations)).toEqual({ val: 2 });
      });
    });

    describe("without data in variations", () => {
      test("returns {}", () => {
        const variations = [{}, {}, {}];

        expect(helpers.getFallbackData(variations)).toEqual({});
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
        helpers.getDataForRenderFunction(app, {
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
