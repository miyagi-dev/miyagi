const deepMerge = require("deepmerge");
const config = require("../../../lib/config.json");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe.skip("lib/state/partials", () => {
  const app = require("express")();
  app.set(
    "config",
    deepMerge(config.defaultUserConfig, {
      components: {
        folder: "/tests/mock-data/files",
        ignores: [],
      },
      files: {
        templates: {
          extension: "hbs",
        },
      },
    })
  );

  describe("with files not being filtered out", () => {
    test.todo("returns an object with shortPath as key and fullPath as value");
  });

  describe("with files being filtered out", () => {
    test.todo("returns an object without the files");
  });
});
