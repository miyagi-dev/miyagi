const config = require("../../../lib/config.json");
const getPartials = require("../../../lib/state/partials.js");
const readDir = require("fs-readdir-recursive");
const deepMerge = require("deepmerge");

jest.mock("fs-readdir-recursive");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/partials", () => {
  const app = require("express")();
  app.set(
    "config",
    deepMerge(config.defaultUserConfig, {
      components: {
        folder: "/tests/mocks/files",
        ignores: [],
      },
      files: {
        templates: {
          extension: "hbs",
        },
      },
    })
  );

  test("calls readDir with the correct path", () => {
    readDir.mockImplementation(() => []);

    getPartials(app);

    expect(readDir).toHaveBeenCalledWith(`${process.cwd()}/tests/mocks/files`);
  });

  describe("with files not being filtered out", () => {
    test("returns an object with shortPath as key and fullPath as value", () => {
      readDir.mockImplementation(() => [
        `directory1/index.hbs`,
        `directory2/index.hbs`,
        `directory3/index.hbs`,
      ]);

      expect(getPartials(app)).toEqual({
        "directory1/index.hbs": `${process.cwd()}/tests/mocks/files/directory1/index.hbs`,
        "directory2/index.hbs": `${process.cwd()}/tests/mocks/files/directory2/index.hbs`,
        "directory3/index.hbs": `${process.cwd()}/tests/mocks/files/directory3/index.hbs`,
      });
    });
  });

  describe("with files being filtered out", () => {
    test("returns an object without the files", () => {
      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          components: {
            folder: "/tests/mocks/files",
            ignores: ["directory1"],
          },
          files: {
            templates: {
              extension: "hbs",
            },
          },
        })
      );

      readDir.mockImplementation(() => [
        `directory1/index.hbs`,
        `directory2/index.hbs`,
        `directory3/index.hbs`,
      ]);

      expect(getPartials(app)).toEqual({
        "directory2/index.hbs": `${process.cwd()}/tests/mocks/files/directory2/index.hbs`,
        "directory3/index.hbs": `${process.cwd()}/tests/mocks/files/directory3/index.hbs`,
      });
    });
  });
});
