const helpers = require("../../../lib/helpers.js");
const log = require("../../../lib/logger.js");
const express = require("express");
const handlebars = require("handlebars");
const partials = require("../../../lib/init/partials.js");
const util = require("util");

jest.mock("../../../lib/logger.js");
jest.mock("handlebars", () => {
  return {
    registerPartial: jest.fn(),
    compile: jest.fn(() => "compiledPartial"),
  };
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/init/partials", () => {
  describe("registerAll()", () => {
    const app = express();
    app.set("state", {
      partials: {
        "foo/index.hbs": "full/path/foo/index.hbs",
      },
    });

    describe("with valid file", () => {
      test("calls hbs.registerPartial after reading the file", async (done) => {
        util.promisify = jest.fn(() => () => true);

        await partials.registerAll(app);

        expect(handlebars.registerPartial).toHaveBeenCalledWith(
          "foo/index.hbs",
          "compiledPartial"
        );
        done();
      });
    });

    describe("with invalid file", () => {
      test("doesn't call hbs.registerPartial, but logs an error", async (done) => {
        util.promisify = jest.fn(() => () => {
          throw new Error();
        });

        await partials.registerAll(app);

        expect(log).toHaveBeenCalledWith(
          "warn",
          "Couldn't find file foo/index.hbs. Is the 'components.folder' in your .headman.js correct?"
        );
        expect(handlebars.registerPartial).not.toHaveBeenCalled();
        done();
      });
    });

    test("calls hbs.registerPartial with layout files", async (done) => {
      util.promisify = jest.fn(() => () => true);
      handlebars.compile = jest.fn(() => "compiledPartial");

      await partials.registerAll(app, true);

      expect(handlebars.registerPartial).toHaveBeenNthCalledWith(
        1,
        "main",
        "compiledPartial"
      );
      expect(handlebars.registerPartial).toHaveBeenNthCalledWith(
        2,
        "iframe",
        "compiledPartial"
      );
      done();
    });
  });

  describe("registerPartial()", () => {
    describe("with valid file", () => {
      test("calls hbs.registerPartial after reading the file", async (done) => {
        helpers.getShortPathFromFullPath = jest.fn(() => "fullName");
        util.promisify = jest.fn(() => () => true);
        handlebars.compile = jest.fn(() => "compiledPartial");

        await partials.registerPartial({}, "foo/index.hbs");

        expect(handlebars.registerPartial).toHaveBeenCalledWith(
          "fullName",
          "compiledPartial"
        );
        done();
      });
    });

    describe("with invalid file", () => {
      test("doesn't call hbs.registerPartial, but logs an error", async (done) => {
        helpers.getShortPathFromFullPath = jest.fn(() => "fullName");
        util.promisify = jest.fn(() => () => {
          throw new Error();
        });

        await partials.registerPartial({}, "foo/index.hbs");

        expect(log).toHaveBeenCalledWith(
          "warn",
          "Couldn't find file fullName. Is the 'components.folder' in your .headman.js correct?"
        );
        expect(handlebars.registerPartial).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
