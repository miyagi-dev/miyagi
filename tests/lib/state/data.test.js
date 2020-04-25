const express = require("express");
const path = require("path");
const util = require("util");

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/menu/data", () => {
  const app = express();

  describe("getFileContents()", () => {
    test("returns an object with stored data from json files and ignores ignored files", async (done) => {
      app.set("config", {
        srcFolder: "tests/mocks/srcFolder/",
        srcFolderIgnores: ["ignored/"],
      });

      util.promisify = jest.fn(() => {
        return () => '{ "bar": "bar" }';
      });
      const {
        getFileContents,
      } = require("../../../lib/state/file-contents.js");
      const data = await getFileContents(app);

      expect(Object.entries(data).length).toBe(2);
      expect(Object.entries(data)[0]).toEqual([
        `${process.cwd()}/tests/mocks/srcFolder/foo/bar/bar.json`,
        { bar: "bar" },
      ]);
      expect(Object.entries(data)[1]).toEqual([
        `${process.cwd()}/tests/mocks/srcFolder/foo/foo.json`,
        { bar: "bar" },
      ]);
      done();
    });
  });

  describe("readFile()", () => {
    describe("with file found", () => {
      describe("parseable", () => {
        test("returns the parsed data", async (done) => {
          util.promisify = jest.fn(() => {
            return () => {
              return '{"foo": "foo"}';
            };
          });
          const { readFile } = require("../../../lib/state/file-contents.js");

          const result = await readFile(path.join(process.cwd(), "file/path"));

          expect(result).toEqual({ foo: "foo" });
          done();
        });
      });

      describe("not parseable", () => {
        test("returns {}", async (done) => {
          util.promisify = jest.fn(() => {
            return () => {
              return "";
            };
          });
          const { readFile } = require("../../../lib/state/file-contents.js");
          const logger = require("../../../lib/logger.js");

          logger.log = jest.fn();

          const result = await readFile(
            app,
            path.join(process.cwd(), "not/parseable")
          );

          expect(result).toEqual({});
          expect(logger.log).toHaveBeenCalled();
          done();
        });
      });
    });

    describe("with file not found", () => {
      test("returns {}", async (done) => {
        util.promisify = jest.fn(() => {
          return () => {
            throw new Error();
          };
        });
        const { readFile } = require("../../../lib/state/file-contents.js");
        const logger = require("../../../lib/logger.js");

        logger.log = jest.fn();

        const result = await readFile(
          app,
          path.join(process.cwd(), `doesnt/exist`)
        );

        expect(result).toEqual({});
        expect(logger.log).toHaveBeenCalled();
        done();
      });
    });
  });
});
