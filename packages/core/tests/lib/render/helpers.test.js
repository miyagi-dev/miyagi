const express = require("express");
const path = require("path");
const deepMerge = require("deepmerge");
const config = require("../../../lib/config.json");
const helpers = require("../../../lib/render/helpers.js");
const log = require("../../../lib/logger.js");
const { doesNotMatch } = require("assert");

jest.mock("../../../lib/logger");

describe("lib/render/helpers", () => {
  describe("mergeRootDataWithVariationData()", () => {
    const app = express();
    app.set("state", {
      fileContents: {},
    });
    app.set("config", config.defaultUserConfig);

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
      test("", async (done) => {
        expect(await helpers.resolveData(app, null, rootData)).toEqual({
          merged: {
            root: true,
            data: "root",
          },
        });
        done();
      });
    });

    describe("with only variationData given", () => {
      test("", async (done) => {
        expect(await helpers.resolveData(app, variationData, null)).toEqual({
          merged: {
            variation: true,
            data: "variation",
          },
        });

        done();
      });
    });

    describe("with rootData and variationData given", () => {
      test("", async (done) => {
        expect(await helpers.resolveData(app, variationData, rootData)).toEqual(
          {
            merged: {
              root: true,
              variation: true,
              data: "variation",
            },
          }
        );

        done();
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
        $variants: [
          {
            $name: "variation",
            resolve: [
              {
                $ref: "resolve/resolve",
              },
            ],
          },
        ],
      };
      fileContents[
        `${process.cwd()}/tests/mocks/resolve/resolve/mocks.json`
      ] = {
        resolve: {
          $ref: "resolve/resolve/resolve",
        },
      };
      fileContents[
        `${process.cwd()}/tests/mocks/resolve/resolve/resolve/mocks.json`
      ] = {
        resolve: "resolve",
      };

      app.set("state", {
        partials: "partials",
        fileContents,
      });

      expect(
        await helpers.resolveData(app, {
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
          await helpers.resolveData(app, {
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
          await helpers.resolveData(app, {
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
          $variants: [
            {
              $name: "variation",
            },
          ],
        };

        app.set("state", {
          partials: "partials",
          fileContents,
        });

        expect(
          await helpers.resolveData(app, {
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
          fileContents: {},
        });

        expect(
          await helpers.resolveData(app, {
            resolve: {
              $name: "variation",
            },
          })
        ).toEqual({
          resolve: {
            $name: "variation",
          },
        });

        done();
      });
    });
  });

  describe("mergeWithGlobalData()", () => {
    test("returns the json from data.json with the passed json", async (done) => {
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

      expect(await helpers.resolveData(app, { bar: "foo" })).toEqual({
        foo: "bar",
        bar: "foo",
      });

      done();
    });
  });

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

  describe("getComponentErrorHtml()", () => {
    describe("with passed error", () => {
      test("it renders the error", () => {
        expect(helpers.getComponentErrorHtml("error")).toEqual(
          '<p class="MiyagiError">error</p>'
        );
      });
    });
    describe("with passed error being null", () => {
      test("it renders the error", () => {
        expect(helpers.getComponentErrorHtml(null)).toEqual(
          '<p class="MiyagiError">Component couldn\'t be rendered.</p>'
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
});
