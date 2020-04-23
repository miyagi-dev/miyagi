const getPartials = require("../../../lib/state/partials.js");
const readDir = require("fs-readdir-recursive");
const { getOnlyWantedFiles } = require("../../../lib/state/_helpers.js");

jest.mock("fs-readdir-recursive");
jest.mock("../../../lib/state/_helpers.js");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/partials", () => {
  const app = require("express")();
  app.set("config", {
    srcFolder: "/tests/mocks/files",
    srcFolderIgnores: [],
    extension: "hbs",
  });

  test("calls readDir with the correct path", () => {
    readDir.mockImplementation(() => []);

    getPartials(app);

    expect(readDir).toHaveBeenCalledWith(`${process.cwd()}/tests/mocks/files`);
  });

  describe("with files not being filtered out", () => {
    test("returns an object with shortPath as key and fullPath as value", () => {
      readDir.mockImplementation(() => [
        `directory1/directory1.hbs`,
        `directory2/directory2.hbs`,
        `directory3/directory3.hbs`,
      ]);
      getOnlyWantedFiles.mockImplementation(() => true);

      expect(getPartials(app)).toEqual({
        "directory1/directory1.hbs": `${process.cwd()}/tests/mocks/files/directory1/directory1.hbs`,
        "directory2/directory2.hbs": `${process.cwd()}/tests/mocks/files/directory2/directory2.hbs`,
        "directory3/directory3.hbs": `${process.cwd()}/tests/mocks/files/directory3/directory3.hbs`,
      });
    });
  });

  describe("with files being filtered out", () => {
    test("returns an object without the files", () => {
      readDir.mockImplementation(() => [
        `directory1/directory1.hbs`,
        `directory2/directory2.hbs`,
        `directory3/directory3.hbs`,
      ]);
      getOnlyWantedFiles.mockImplementation(() => false);

      expect(getPartials(app)).toEqual({});
    });
  });
});
