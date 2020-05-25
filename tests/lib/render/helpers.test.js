const config = require("../../../lib/config.json");
const helpers = require("../../../lib/render/_helpers.js");
const log = require("../../../lib/logger.js");
const express = require("express");
const path = require("path");
const deepMerge = require("deepmerge");

jest.mock("../../../lib/logger");

describe("lib/render/_helpers", () => {
  describe("mergeWithGlobalData()", () => {
    test("returns the json from data.json with the passed json", () => {
      const app = express();
      const fileContents = {};
      const fullPath = path.join(process.cwd(), "srcFolder/data.json");
      fileContents[fullPath] = { foo: "bar" };

      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          components: {
            folder: "srcFolder/",
          },
        })
      );
      app.set("state", {
        fileContents,
      });

      expect(helpers.mergeWithGlobalData(app, { bar: "foo" })).toEqual({
        foo: "bar",
        bar: "foo",
      });
    });
  });

  describe("getFallbackData()", () => {
    describe("with data in variations", () => {
      test("returns the data of the first variation with data", () => {
        const variations = [
          {},
          {
            data: 2,
          },
          {
            data: 3,
          },
        ];

        expect(helpers.getFallbackData(variations)).toEqual(2);
      });
    });

    describe("without data in variations", () => {
      test("returns {}", () => {
        const variations = [{}, {}, {}];

        expect(helpers.getFallbackData(variations)).toEqual({});
      });
    });
  });

  describe("getComponentErrorHtml()", () => {
    describe("with passed error", () => {
      test("it renders the error", () => {
        expect(helpers.getComponentErrorHtml("error")).toEqual(
          '<p class="HeadmanError">error</p>'
        );
      });
    });
    describe("with passed error being null", () => {
      test("it renders the error", () => {
        expect(helpers.getComponentErrorHtml(null)).toEqual(
          '<p class="HeadmanError">Component couldn\'t be rendered.</p>'
        );
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

  describe("mergeRootDataWithVariationData()", () => {
    const rootData = {
      merged: {
        root: true,
        data: "root",
      },
    };

    const variationData = {
      merged: {
        variation: true,
        data: "variation",
      },
    };

    describe("with only rootData given", () => {
      expect(helpers.mergeRootDataWithVariationData(rootData, null)).toEqual({
        merged: {
          root: true,
          data: "root",
        },
      });
    });

    describe("with only variationData given", () => {
      expect(
        helpers.mergeRootDataWithVariationData(null, variationData)
      ).toEqual({
        merged: {
          variation: true,
          data: "variation",
        },
      });
    });

    describe("with rootData and variationData given", () => {
      expect(
        helpers.mergeRootDataWithVariationData(rootData, variationData)
      ).toEqual({
        merged: {
          root: true,
          variation: true,
          data: "variation",
        },
      });
    });
  });

  describe("overwriteJsonLinksWithJsonData()", () => {
    test("resolves linked json data", async (done) => {
      const app = express();
      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          components: {
            folder: "tests/mocks/",
          },
        })
      );
      const fileContents = {};
      fileContents[`${process.cwd()}/tests/mocks/resolve/mocks.json`] = {
        variations: [
          {
            name: "variation",
            data: {
              resolve: [
                {
                  $ref: "resolve/resolve",
                },
              ],
            },
          },
        ],
      };
      fileContents[
        `${process.cwd()}/tests/mocks/resolve/resolve/mocks.json`
      ] = {
        data: {
          resolve: {
            $ref: "resolve/resolve/resolve",
          },
        },
      };
      fileContents[
        `${process.cwd()}/tests/mocks/resolve/resolve/resolve/mocks.json`
      ] = {
        data: {
          resolve: "resolve",
        },
      };

      app.set("state", {
        partials: "partials",
        fileContents,
      });

      expect(
        await helpers.overwriteJsonLinksWithJsonData(app, {
          resolve: {
            $ref: "resolve#variation",
          },
        })
      ).toEqual({
        resolve: {
          resolve: [
            {
              resolve: {
                resolve: "resolve",
              },
            },
          ],
        },
      });

      done();
    });

    describe("with passing null", () => {
      test("", async (done) => {
        const app = express();
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            components: {
              folder: "tests/mocks/",
            },
          })
        );
        const fileContents = {};
        app.set("state", {
          partials: "partials",
          fileContents,
        });

        expect(
          await helpers.overwriteJsonLinksWithJsonData(app, {
            resolve: null,
          })
        ).toEqual({
          resolve: null,
        });

        done();
      });
    });

    describe("with value for component not being stored in data", () => {
      test("returns {}, logs error", async (done) => {
        const app = express();
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            components: {
              folder: "tests/mocks/",
            },
          })
        );
        app.set("state", {
          partials: "partials",
          fileContents: {},
        });

        expect(
          await helpers.overwriteJsonLinksWithJsonData(app, {
            resolve: {
              $ref: "some/component",
            },
          })
        ).toEqual({
          resolve: {},
        });
        expect(log).toHaveBeenCalledWith(
          "warn",
          "Couldn't find file some/component/mocks.json. Please check that it's linked correctly."
        );

        done();
      });
    });

    describe("variant not having any data", () => {
      test("returns {}", async (done) => {
        const app = express();
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            components: {
              folder: "tests/mocks/",
            },
          })
        );
        const fileContents = {};
        fileContents[`${process.cwd()}/tests/mocks/resolve/mocks.json`] = {
          variations: [
            {
              name: "variation",
            },
          ],
        };

        app.set("state", {
          partials: "partials",
          fileContents,
        });

        expect(
          await helpers.overwriteJsonLinksWithJsonData(app, {
            resolve: {
              $ref: "resolve#variation",
            },
          })
        ).toEqual({
          resolve: {},
        });

        done();
      });
    });

    describe("variant not having any data", () => {
      test("returns {}", async (done) => {
        const app = express();
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            components: {
              folder: "tests/mocks/",
            },
          })
        );
        app.set("state", {
          partials: "partials",
        });

        expect(
          await helpers.overwriteJsonLinksWithJsonData(app, {
            resolve: {
              name: "variation",
            },
          })
        ).toEqual({
          resolve: {
            name: "variation",
          },
        });

        done();
      });
    });
  });
});
