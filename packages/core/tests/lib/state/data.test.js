import express from "express";
import path from "path";
import util from "util";

import appConfig from "../../../lib/miyagi-config.js";

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/menu/data", () => {
  const app = express();

  describe("getFileContents()", () => {
    test("returns an object with stored data from json files and ignores ignored files", async () => {
      app.set("config", {
        ...appConfig.defaultUserConfig,
        components: {
          folder: "tests/mock-data/srcFolder",
          ignores: [
            path.join(process.cwd(), "tests/mock-data/srcFolder", "ignored/"),
          ],
        },
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
        `${process.cwd()}/tests/mock-data/srcFolder/foo/bar/mocks.json`,
        { bar: "bar" },
      ]);
      expect(Object.entries(data)[1]).toEqual([
        `${process.cwd()}/tests/mock-data/srcFolder/foo/mocks.json`,
        { bar: "bar" },
      ]);
    });
  });

  describe("readFile()", () => {
    describe("with file found", () => {
      describe("parseable", () => {
        test("returns the parsed data", async () => {
          util.promisify = jest.fn(() => {
            return () => {
              return '{"foo": "foo"}';
            };
          });
          const { readFile } = require("../../../lib/state/file-contents.js");

          const result = await readFile(
            app,
            path.join(process.cwd(), "file/path")
          );

          expect(result).toEqual({ foo: "foo" });
        });
      });

      describe("not parseable", () => {
        test("returns {}", async () => {
          util.promisify = jest.fn(() => {
            return () => {
              return "";
            };
          });
          const { readFile } = await import(
            "../../../lib/state/file-contents.js"
          );
          const log = await import("../../../lib/logger.js");

          jest.mock("../../../lib/logger");

          const result = await readFile(
            app,
            path.join(process.cwd(), "not/parseable")
          );

          expect(result).toEqual({});
          expect(log.default).toHaveBeenCalled();
        });
      });
    });

    describe("with file not found", () => {
      test("returns {}", async () => {
        util.promisify = jest.fn(() => {
          return () => {
            throw new Error();
          };
        });
        const { readFile } = await import(
          "../../../lib/state/file-contents.js"
        );
        const log = await import("../../../lib/logger.js");

        jest.mock("../../../lib/logger");

        const result = await readFile(
          app,
          path.join(process.cwd(), `doesnt/exist`)
        );

        expect(result).toEqual({});
        expect(log.default).toHaveBeenCalled();
      });
    });
  });
});
