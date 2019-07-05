const appConfig = require("../mocks/config.json");
const setConfig = require("../../src/setConfig.js");
const logger = require("../../src/logger.js");

jest.mock("../../src/logger.js");

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("src/setConfig", () => {
  describe("with arrays for user cssFiles and user jsFiles", () => {
    test("merges given user config and app config and sets app.config", () => {
      const app = require("express")();

      setConfig(app, appConfig, {
        projectName: "userName",
        srcFolderIgnores: ["user/ignores/"],
        srcFolder: "user/srcFolder/",
        cssFiles: ["user/css/index.css"],
        jsFiles: ["user/js/index.js"],
        validations: {
          html: false,
          accessibility: false
        }
      });

      expect(app.get("config")).toEqual({
        projectName: "userName",
        srcFolderIgnores: ["node_modules", ".git", "user/ignores/"],
        srcFolder: "user/srcFolder/",
        cssFiles: ["user/css/index.css"],
        jsFiles: ["user/js/index.js"],
        validations: {
          html: false,
          accessibility: false
        }
      });
    });

    test("sanitizes all given paths by the user", () => {
      const app = require("express")();

      setConfig(app, appConfig, {
        projectName: "userName",
        srcFolderIgnores: "../../user/ignores",
        srcFolder: "/user/srcFolder",
        cssFiles: ["../../../../user/css/index.css"],
        jsFiles: ["/user/js/index.js"],
        validations: {
          html: false,
          accessibility: false
        }
      });

      expect(app.get("config")).toEqual({
        projectName: "userName",
        srcFolderIgnores: ["node_modules", ".git", "user/ignores/"],
        srcFolder: "user/srcFolder/",
        cssFiles: ["user/css/index.css"],
        jsFiles: ["user/js/index.js"],
        validations: {
          html: false,
          accessibility: false
        }
      });
    });
  });

  describe("with an object for user cssFiles and user jsFiles", () => {
    test("merges given user config and app config and sets app.config", () => {
      const app = require("express")();

      setConfig(app, appConfig, {
        projectName: "userName",
        srcFolderIgnores: ["user/ignores/"],
        srcFolder: "user/srcFolder/",
        cssFiles: {
          test: ["user/dev/css/index.css"]
        },
        jsFiles: {
          test: ["user/dev/js/index.js"]
        },
        validations: {
          html: false,
          accessibility: false
        }
      });

      expect(app.get("config")).toEqual({
        projectName: "userName",
        srcFolderIgnores: ["node_modules", ".git", "user/ignores/"],
        srcFolder: "user/srcFolder/",
        cssFiles: {
          test: ["user/dev/css/index.css"]
        },
        jsFiles: {
          test: ["user/dev/js/index.js"]
        },
        validations: {
          html: false,
          accessibility: false
        }
      });
    });

    test("sanitizes all given paths by the user", () => {
      const app = require("express")();

      setConfig(app, appConfig, {
        projectName: "userName",
        srcFolderIgnores: "../../user/ignores",
        srcFolder: "/user/srcFolder",
        cssFiles: {
          test: ["../../../../user/css/index.css"]
        },
        jsFiles: {
          test: ["/user/js/index.js"]
        },
        validations: {
          html: false,
          accessibility: false
        }
      });

      expect(app.get("config")).toEqual({
        projectName: "userName",
        srcFolderIgnores: ["node_modules", ".git", "user/ignores/"],
        srcFolder: "user/srcFolder/",
        cssFiles: {
          test: ["user/css/index.css"]
        },
        jsFiles: {
          test: ["user/js/index.js"]
        },
        validations: {
          html: false,
          accessibility: false
        }
      });
    });

    describe("with missing env key in assets objects", () => {
      const app = require("express")();

      test("it logs an error", () => {
        logger.log = jest.fn();

        setConfig(app, appConfig, {
          cssFiles: {
            foo: ["user/css/index.css"]
          },
          jsFiles: {
            foo: ["user/js/index.js"]
          }
        });

        expect(logger.log).toHaveBeenNthCalledWith(
          1,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in folders.assets in your roundup.json, so roundup is not able to deliver your css files."
        );

        expect(logger.log).toHaveBeenNthCalledWith(
          2,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in folders.assets in your roundup.json, so roundup is not able to deliver your js files."
        );
      });

      test("it sets the asset keys to {}", () => {
        logger.log = jest.fn();

        setConfig(app, appConfig, {
          cssFiles: {
            foo: ["user/css/index.css"]
          },
          jsFiles: {
            foo: ["user/js/index.js"]
          }
        });
        expect(app.get("config").cssFiles).toEqual({});
        expect(app.get("config").jsFiles).toEqual({});
      });
    });
  });

  describe("without any empty config given", () => {
    test("it returns the default values", () => {
      const app = require("express")();

      setConfig(app, appConfig);

      expect(app.get("config")).toEqual({
        projectName: "roundup",
        srcFolder: "/",
        cssFiles: [],
        jsFiles: [],
        srcFolderIgnores: ["node_modules", ".git"],
        validations: {
          html: true,
          accessibility: true
        }
      });
    });
  });
});
