const deepMerge = require("deepmerge");
const express = require("express");
const path = require("path");

const config = require("../../lib/config.json");
const { resolveVariationData } = require("../../lib/mocks");
const log = require("../../lib/logger.js");

jest.mock("../../lib/logger.js");

describe("api/resolve", () => {
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
      test("", async () => {
        expect(await resolveVariationData(app, null, rootData)).toEqual({
          merged: {
            merged: {
              root: true,
              data: "root",
            },
          },
          resolved: {
            merged: {
              root: true,
              data: "root",
            },
          },
        });
      });
    });

    describe("with only variationData given", () => {
      test("", async () => {
        expect(await resolveVariationData(app, variationData, null)).toEqual({
          merged: {
            merged: {
              variation: true,
              data: "variation",
            },
          },
          resolved: {
            merged: {
              variation: true,
              data: "variation",
            },
          },
        });
      });
    });

    describe("with rootData and variationData given", () => {
      test("", async () => {
        expect(
          await resolveVariationData(app, variationData, rootData)
        ).toEqual({
          merged: {
            merged: {
              root: true,
              variation: true,
              data: "variation",
            },
          },
          resolved: {
            merged: {
              root: true,
              variation: true,
              data: "variation",
            },
          },
        });
      });
    });
  });

  describe("overwriteJsonLinksWithJsonData()", () => {
    test("resolves linked json data", async () => {
      const app = express();
      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          components: {
            folder: "tests/mock-data/",
          },
        })
      );
      const fileContents = {};
      fileContents[`${process.cwd()}/tests/mock-data/resolve/mocks.json`] = {
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
        `${process.cwd()}/tests/mock-data/resolve/resolve/mocks.json`
      ] = {
        resolve: {
          $ref: "resolve/resolve/resolve",
        },
      };
      fileContents[
        `${process.cwd()}/tests/mock-data/resolve/resolve/resolve/mocks.json`
      ] = {
        resolve: "resolve",
      };

      app.set("state", {
        partials: "partials",
        fileContents,
      });

      expect(
        await resolveVariationData(app, {
          resolve: {
            $ref: "resolve#variation",
          },
        })
      ).toEqual({
        merged: {
          resolve: {
            $ref: "resolve#variation",
          },
        },
        resolved: {
          resolve: {
            resolve: [
              {
                resolve: {
                  resolve: "resolve",
                },
              },
            ],
          },
        },
      });
    });

    describe("with passing null", () => {
      test("", async () => {
        const app = express();
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            components: {
              folder: "tests/mock-data/",
            },
          })
        );
        const fileContents = {};
        app.set("state", {
          partials: "partials",
          fileContents,
        });

        expect(
          await resolveVariationData(app, {
            resolve: null,
          })
        ).toEqual({
          merged: { resolve: null },
          resolved: { resolve: null },
        });
      });
    });

    describe("with value for component not being stored in data", () => {
      test("returns {}, logs error", async () => {
        const app = express();
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            components: {
              folder: "tests/mock-data/",
            },
          })
        );
        app.set("state", {
          partials: "partials",
          fileContents: {},
        });

        expect(
          await resolveVariationData(app, {
            resolve: {
              $ref: "some/component",
            },
          })
        ).toEqual({
          merged: {
            resolve: {
              $ref: "some/component",
            },
          },
          resolved: {
            resolve: {},
          },
        });
        expect(log).toHaveBeenCalledWith(
          "warn",
          "Couldn't find file some/component/mocks.json. Please check that it's linked correctly."
        );
      });
    });

    describe("variant not having any data", () => {
      test("returns {}", async () => {
        const app = express();
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            components: {
              folder: "tests/mock-data/",
            },
          })
        );
        const fileContents = {};
        fileContents[`${process.cwd()}/tests/mock-data/resolve/mocks.json`] = {
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
          await resolveVariationData(app, {
            resolve: {
              $ref: "resolve#variation",
            },
          })
        ).toEqual({
          merged: {
            resolve: {
              $ref: "resolve#variation",
            },
          },
          resolved: {
            resolve: {},
          },
        });
      });
    });

    describe("variant not having any data", () => {
      test("returns {}", async () => {
        const app = express();
        app.set(
          "config",
          deepMerge(config.defaultUserConfig, {
            components: {
              folder: "tests/mock-data/",
            },
          })
        );
        app.set("state", {
          partials: "partials",
          fileContents: {},
        });

        expect(
          await resolveVariationData(app, {
            resolve: {
              $name: "variation",
            },
          })
        ).toEqual({
          merged: {
            resolve: {
              $name: "variation",
            },
          },
          resolved: {
            resolve: {
              $name: "variation",
            },
          },
        });
      });
    });
  });

  describe("mergeWithGlobalData()", () => {
    test("returns the json from data.json with the passed json", async () => {
      const app = express();
      const fileContents = {};
      const fullPath = path.join(process.cwd(), "srcFolder/data.json");
      fileContents[fullPath] = { foo: "bar" };

      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          components: {
            folder: "srcFolder",
          },
        })
      );
      app.set("state", {
        fileContents,
      });

      expect(await resolveVariationData(app, { bar: "foo" })).toEqual({
        merged: {
          foo: "bar",
          bar: "foo",
        },
        resolved: {
          foo: "bar",
          bar: "foo",
        },
      });
    });
  });
});
