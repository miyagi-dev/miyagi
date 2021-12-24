import express from "express";
import path from "path";

jest.mock("../../../lib/logger.js");
jest.mock("handlebars", () => {
  return {
    registerPartial: jest.fn(),
    compile: jest.fn(() => "compiledPartial"),
  };
});
jest.mock("../../../lib/__dirname.js", () => `${process.cwd()}/lib`);

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
        "tests/mock-data/srcFolder/component/index.hbs"
      ),
      "foo/index2.hbs": path.join(
        process.cwd(),
        "tests/mock-data/srcFolder/component/doesNotExist.hbs"
      ),
    },
  });

  describe("registerAll()", () => {
    describe("with valid file", () => {
      test("calls hbs.registerPartial after reading the file", async () => {
        const handlebars = await import("handlebars");
        const partials = await import("../../../lib/init/partials.js");

        handlebars.compile = jest.fn(() => "compiledPartial");

        await partials.default.registerAll(app, true);

        expect(handlebars.registerPartial).toHaveBeenCalledWith(
          "foo/index.hbs",
          "compiledPartial"
        );
      });
    });

    describe("with invalid file", () => {
      test("doesn't call hbs.registerPartial, but logs an error", async () => {
        const handlebars = await import("handlebars");
        const partials = await import("../../../lib/init/partials.js");
        const log = await import("../../../lib/logger.js");

        handlebars.compile = jest.fn(() => "compiledPartial");

        await partials.default.registerAll(app, true);

        expect(log.default).toHaveBeenCalledWith(
          "warn",
          "Couldn't find file foo/index2.hbs. Is the 'components.folder' in your configuration set correctly?"
        );
        expect(handlebars.registerPartial).not.toHaveBeenCalledWith(
          "foo/index2.hbs"
        );
      });
    });

    test("calls hbs.registerPartial with layout and partial files", async () => {
      const handlebars = await import("handlebars");
      const partials = await import("../../../lib/init/partials.js");

      handlebars.compile = jest.fn(() => "compiledPartial");

      await partials.default.registerAll(app);

      expect(handlebars.registerPartial).toHaveBeenCalledTimes(3);

      expect(handlebars.registerPartial).toHaveBeenNthCalledWith(
        1,
        "iframe_default",
        "compiledPartial"
      );
      expect(handlebars.registerPartial).toHaveBeenNthCalledWith(
        2,
        "iframe_index",
        "compiledPartial"
      );
      expect(handlebars.registerPartial).toHaveBeenNthCalledWith(
        3,
        "foo/index.hbs",
        "compiledPartial"
      );
    });
  });

  describe("registerPartial()", () => {
    describe("with valid file", () => {
      test("calls hbs.registerPartial after reading the file", async () => {
        const handlebars = await import("handlebars");
        jest.mock("../../../lib/helpers.js", () => {
          return {
            getShortPathFromFullPath: jest.fn(() => "fullName"),
          };
        });

        const partials = await import("../../../lib/init/partials.js");
        handlebars.compile = jest.fn(() => "compiledPartial");

        await partials.default.registerPartial(
          {},
          path.join(
            process.cwd(),
            "tests/mock-data/srcFolder/component/index.hbs"
          )
        );

        expect(handlebars.registerPartial).toHaveBeenCalledWith(
          "fullName",
          "compiledPartial"
        );
      });
    });

    describe("with invalid file", () => {
      test("doesn't call hbs.registerPartial, but logs an error", async () => {
        const handlebars = await import("handlebars");
        const log = await import("../../../lib/logger.js");

        jest.mock("../../../lib/helpers.js", () => {
          return {
            getShortPathFromFullPath: jest.fn(() => "fullName"),
          };
        });

        const partials = await import("../../../lib/init/partials.js");

        await partials.default.registerPartial(
          app,
          "tests/mock-data/srcFolder/component/doesNotExist.hbs"
        );

        expect(log.default).toHaveBeenCalledWith(
          "warn",
          "Couldn't find file fullName. Is the 'components.folder' in your configuration set correctly?"
        );
        expect(handlebars.registerPartial).not.toHaveBeenCalled();
      });
    });
  });
});
