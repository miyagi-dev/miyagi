const express = require("express");
const path = require("path");
const handlebars = require("handlebars");
const helpers = require("../../../lib/helpers.js");
const log = require("../../../lib/logger.js");
const partials = require("../../../lib/init/partials.js");

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
  const app = express();
  app.set("state", {
    partials: {
      "foo/index.hbs": path.join(
        process.cwd(),
        "tests/mocks/srcFolder/component/index.hbs"
      ),
      "foo/index2.hbs": path.join(
        process.cwd(),
        "tests/mocks/srcFolder/component/doesNotExist.hbs"
      ),
    },
  });

  describe("registerAll()", () => {
    describe("with valid file", () => {
      test("calls hbs.registerPartial after reading the file", async (done) => {
        handlebars.compile = jest.fn(() => "compiledPartial");

        await partials.registerAll(app, true);

        expect(handlebars.registerPartial).toHaveBeenCalledWith(
          "foo/index.hbs",
          "compiledPartial"
        );
        done();
      });
    });

    describe("with invalid file", () => {
      test("doesn't call hbs.registerPartial, but logs an error", async (done) => {
        handlebars.compile = jest.fn(() => "compiledPartial");

        await partials.registerAll(app, true);

        expect(log).toHaveBeenCalledWith(
          "warn",
          "Couldn't find file foo/index2.hbs. Is the 'components.folder' in your configuration set correctly?"
        );
        expect(handlebars.registerPartial).not.toHaveBeenCalledWith(
          "foo/index2.hbs"
        );
        done();
      });
    });

    test("calls hbs.registerPartial with layout files", async (done) => {
      handlebars.compile = jest.fn(() => "compiledPartial");

      await partials.registerAll(app, true);

      expect(handlebars.registerPartial).toHaveBeenCalledWith(
        "main",
        "compiledPartial"
      );
      expect(handlebars.registerPartial).toHaveBeenCalledWith(
        "iframe",
        "compiledPartial"
      );
      expect(handlebars.registerPartial).toHaveBeenCalledWith(
        "component_iframe",
        "compiledPartial"
      );
      done();
    });
  });

  describe("registerPartial()", () => {
    describe("with valid file", () => {
      test("calls hbs.registerPartial after reading the file", async (done) => {
        helpers.getShortPathFromFullPath = jest.fn(() => "fullName");
        handlebars.compile = jest.fn(() => "compiledPartial");

        await partials.registerPartial(
          {},
          path.join(process.cwd(), "tests/mocks/srcFolder/component/index.hbs")
        );

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

        await partials.registerPartial(
          app,
          "tests/mocks/srcFolder/component/doesNotExist.hbs"
        );

        expect(log).toHaveBeenCalledWith(
          "warn",
          "Couldn't find file fullName. Is the 'components.folder' in your configuration set correctly?"
        );
        expect(handlebars.registerPartial).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
