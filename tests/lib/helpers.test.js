const config = require("../mocks/config.json");
const helpers = require("../../lib/helpers.js");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/helpers", () => {
  const app = require("express")();
  app.set("config", { srcFolder: "srcFolder/", extension: "hbs" });

  describe("fileIsOfGivenType()", () => {
    describe("with given filename ending with given extension", () => {
      test("returns true", () => {
        expect(helpers.fileIsOfGivenType("foo/bar.baz", "baz")).toBe(true);
      });
    });

    describe("with given filename not ending with given extension", () => {
      test("returns false", () => {
        expect(helpers.fileIsOfGivenType("fo.b", "barz")).toBe(false);
        expect(helpers.fileIsOfGivenType("foo/bar.baz", "foo")).toBe(false);
      });
    });

    describe("with given filename not being a string", () => {
      test("returns false", () => {
        expect(helpers.fileIsOfGivenType({}, "barz")).toBe(false);
      });
    });
  });

  describe("fileIsDataFile()", () => {
    test("calls fileIsOfGivenType() with passed fileName and config.dataFileType", () => {
      const spy = jest.spyOn(helpers, "fileIsOfGivenType");

      helpers.fileIsDataFile("foo/bar");

      expect(spy).toHaveBeenCalledWith("foo/bar", config.dataFileType);

      spy.mockRestore();
    });

    test("returns the result from fileIsOfGivenType()", () => {
      helpers.fileIsOfGivenType = jest.fn().mockReturnValue(true);
      expect(helpers.fileIsDataFile()).toBe(true);
      helpers.fileIsOfGivenType = jest.fn().mockReturnValue("foo");
      expect(helpers.fileIsDataFile()).toBe("foo");
    });
  });

  describe("fileIsTemplateFile()", () => {
    test("calls fileIsOfGivenType() with passed fileName and app.config.extension", () => {
      const spy = jest.spyOn(helpers, "fileIsOfGivenType");

      helpers.fileIsTemplateFile(app, "foo/bar");

      expect(spy).toHaveBeenCalledWith("foo/bar", app.get("config").extension);

      spy.mockRestore();
    });

    test("returns the result from fileIsOfGivenType()", () => {
      helpers.fileIsOfGivenType = jest.fn().mockReturnValue(true);
      expect(helpers.fileIsTemplateFile(app)).toBe(true);
      helpers.fileIsOfGivenType = jest.fn().mockReturnValue("foo");
      expect(helpers.fileIsTemplateFile(app)).toBe("foo");
    });
  });

  describe("getFullPathFromShortPath()", () => {
    test("prepends process.cwd() and the srcFolder to a path", () => {
      expect(helpers.getFullPathFromShortPath(app, "/foo/bar")).toEqual(
        `${process.cwd()}/srcFolder/foo/bar`
      );
    });
  });

  describe("getTemplatePathFromDataPath()", () => {
    test("replaces the dataFileType ending with the template extension", () => {
      expect(helpers.getTemplatePathFromDataPath(app, "/foo/bar.json")).toEqual(
        "/foo/bar.hbs"
      );
    });
  });
});
