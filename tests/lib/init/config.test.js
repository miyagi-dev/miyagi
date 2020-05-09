const getMergedConfig = require("../../../lib/init/config.js");
const logger = require("../../../lib/logger.js");

jest.mock("../../../lib/logger.js");

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/init/config", () => {
  describe("with strings for user cssFiles and user jsFiles", () => {
    test("merges given user config and app config and returns it", () => {
      const conf = getMergedConfig({
        projectName: "userName",
        srcFolder: "user/srcFolder/",
        cssFiles: "user/css/index.css",
        jsFiles: "user/js/index.js",
        templates: {},
      });

      expect(conf.cssFiles).toEqual(["user/css/index.css"]);
      expect(conf.jsFiles).toEqual(["user/js/index.js"]);
    });

    test("sanitizes all given paths by the user", () => {
      const conf = getMergedConfig({
        projectName: "userName",
        srcFolder: "/user/srcFolder",
        cssFiles: "./user/css/index.css",
        jsFiles: "/user/js/index.js",
        templates: {},
      });

      expect(conf.cssFiles).toEqual(["user/css/index.css"]);
      expect(conf.jsFiles).toEqual(["user/js/index.js"]);
    });
  });

  describe("with arrays for user cssFiles and user jsFiles", () => {
    test("merges given user config and app config and returns it", () => {
      const conf = getMergedConfig({
        projectName: "userName",
        srcFolder: "user/srcFolder/",
        cssFiles: ["user/css/index.css"],
        jsFiles: ["user/js/index.js"],
        templates: {},
      });

      expect(conf.cssFiles).toEqual(["user/css/index.css"]);
      expect(conf.jsFiles).toEqual(["user/js/index.js"]);
    });

    test("sanitizes all given paths by the user", () => {
      const conf = getMergedConfig({
        projectName: "userName",
        srcFolder: "/user/srcFolder",
        cssFiles: ["./user/css/index.css"],
        jsFiles: ["/user/js/index.js"],
        templates: {},
      });

      expect(conf.cssFiles).toEqual(["user/css/index.css"]);
      expect(conf.jsFiles).toEqual(["user/js/index.js"]);
    });
  });

  describe("with an object for user cssFiles and user jsFiles", () => {
    describe("values are arrays", () => {
      test("merges given user config and app config and returns it", () => {
        const conf = getMergedConfig({
          projectName: "userName",
          srcFolder: "user/srcFolder/",
          cssFiles: {
            test: ["user/dev/css/index.css"],
          },
          jsFiles: {
            test: ["user/dev/js/index.js"],
          },
          templates: {},
        });

        expect(conf.cssFiles).toEqual(["user/dev/css/index.css"]);
        expect(conf.jsFiles).toEqual(["user/dev/js/index.js"]);
      });

      test("sanitizes all given paths by the user", () => {
        const conf = getMergedConfig({
          projectName: "userName",
          srcFolder: "/user/srcFolder",
          cssFiles: ["./user/css/index.css"],
          jsFiles: ["/user/js/index.js"],
          templates: {},
        });

        expect(conf.cssFiles).toEqual(["user/css/index.css"]);
        expect(conf.jsFiles).toEqual(["user/js/index.js"]);
      });
    });

    describe("values are strings", () => {
      test("merges given user config and app config and returns it", () => {
        const conf = getMergedConfig({
          projectName: "userName",
          srcFolder: "user/srcFolder/",
          cssFiles: {
            test: "user/dev/css/index.css",
          },
          jsFiles: {
            test: "user/dev/js/index.js",
          },
          templates: {},
        });

        expect(conf.cssFiles).toEqual(["user/dev/css/index.css"]);
        expect(conf.jsFiles).toEqual(["user/dev/js/index.js"]);
      });

      test("sanitizes all given paths by the user", () => {
        const conf = getMergedConfig({
          projectName: "userName",
          srcFolder: "/user/srcFolder",
          cssFiles: "./user/css/index.css",
          jsFiles: "/user/js/index.js",
          templates: {},
        });

        expect(conf.cssFiles).toEqual(["user/css/index.css"]);
        expect(conf.jsFiles).toEqual(["user/js/index.js"]);
      });
    });

    describe("with missing env key in assets objects", () => {
      test("it logs an error", () => {
        logger.log = jest.fn();

        getMergedConfig({
          cssFiles: {
            foo: ["user/css/index.css"],
          },
          jsFiles: {
            foo: ["user/js/index.js"],
          },
          templates: {},
        });

        expect(logger.log).toHaveBeenNthCalledWith(
          1,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in folders.assets in your headman.json, so headman is not able to deliver your css files."
        );

        expect(logger.log).toHaveBeenNthCalledWith(
          2,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in folders.assets in your headman.json, so headman is not able to deliver your js files."
        );
      });

      test("it sets the asset keys to []", () => {
        logger.log = jest.fn();

        const conf = getMergedConfig({
          cssFiles: {
            foo: ["user/css/index.css"],
          },
          jsFiles: {
            foo: ["user/js/index.js"],
          },
          templates: {},
        });
        expect(conf.cssFiles).toEqual([]);
        expect(conf.jsFiles).toEqual([]);
      });
    });
  });

  describe("without any empty config given", () => {
    test("it returns the default values", () => {
      expect(getMergedConfig({ templates: {} })).toEqual({
        projectName: "headman",
        srcFolder: "",
        build: {
          folder: "build",
        },
        cssFiles: [],
        jsFiles: [],
        es6Modules: false,
        srcFolderIgnores: [
          "node_modules",
          ".git",
          "package.json",
          "package-lock.json",
          "headman.json",
        ],
        validations: {
          html: true,
          accessibility: true,
        },
        reload: true,
        templates: {},
      });
    });
  });

  describe("with srcFolder === '.'", () => {
    test("it sets srcFolder to ''", () => {
      expect(
        getMergedConfig({
          srcFolder: ".",
          templates: {},
        }).srcFolder
      ).toEqual("");
    });
  });

  describe("with srcFolder === '/'", () => {
    test("it sets srcFolder to ''", () => {
      expect(
        getMergedConfig({
          srcFolder: "/",
          templates: {},
        }).srcFolder
      ).toEqual("");
    });
  });
});
