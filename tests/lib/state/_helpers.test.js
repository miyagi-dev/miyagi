const helpers = require("../../../lib/state/_helpers.js");
const logger = require("../../../lib/logger.js");
const express = require("express");

logger.log = jest.fn();

describe("lib/state/_helpers", () => {
  describe("getOnlyWantedFiles()", () => {
    const app = express();
    app.set("config", {
      srcFolder: "srcFolder/",
      srcFolderIgnores: ["foo/bar"]
    });

    describe("with ignored file", () => {
      test("returns false", () => {
        expect(helpers.getOnlyWantedFiles(app, "foo/bar/bar.hbs", "hbs")).toBe(
          false
        );
      });
    });

    describe("with file with unwanted file type", () => {
      test("returns false", () => {
        expect(helpers.getOnlyWantedFiles(app, "bar/bar.hbs", "twig")).toBe(
          false
        );
      });
    });

    describe("with file that is not in folder with same name", () => {
      test("returns false", () => {
        expect(helpers.getOnlyWantedFiles(app, "foo/bar.hbs", "hbs")).toBe(
          false
        );
      });
    });

    describe("with wanted file", () => {
      test("returns true", () => {
        expect(helpers.getOnlyWantedFiles(app, "srcFolder.hbs", "hbs")).toBe(
          true
        );
        expect(helpers.getOnlyWantedFiles(app, "foo/foo.hbs", "hbs")).toBe(
          true
        );
      });
    });

    describe("with logError === true", () => {
      describe("with wanted file", () => {
        test("it doesn't log an error", () => {
          const spy = jest.spyOn(logger, "log");

          helpers.getOnlyWantedFiles(app, "foo/foo.hbs", "hbs", true);
          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe("with unwanted file", () => {
        test("it logs an error", () => {
          const spy = jest.spyOn(logger, "log");

          helpers.getOnlyWantedFiles(app, "foo/index.hbs", "hbs", true);
          expect(spy).toHaveBeenCalledWith(
            "warn",
            "foo/index.hbs ignored because the parent directory doesn't have the same name."
          );
        });
      });
    });
  });

  describe("isNotIgnored()", () => {
    const ignoredFolders = ["foo/bar"];

    describe("for file that is not in an ignored folder", () => {
      test("returns true", () => {
        expect(helpers.isNotIgnored("foo/index.hbs", ignoredFolders)).toBe(
          true
        );
        expect(helpers.isNotIgnored("bar/baz/index.hbs", ignoredFolders)).toBe(
          true
        );
      });
    });

    describe("for file that is in an ignored folder", () => {
      test("returns false", () => {
        expect(helpers.isNotIgnored("foo/bar/index.hbs", ignoredFolders)).toBe(
          false
        );
      });
    });
  });
});
