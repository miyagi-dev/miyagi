const setConfig = require("../../../lib/init/config.js");
const logger = require("../../../lib/logger.js");

jest.mock("../../../lib/logger.js");

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/init/config", () => {
  describe("with strings for user cssFiles and user jsFiles", () => {
    test("merges given user config and app config and sets app.config", () => {
      const app = require("express")();

      setConfig(app, {
        projectName: "userName",
        srcFolder: "user/srcFolder/",
        cssFiles: "user/css/index.css",
        jsFiles: "user/js/index.js"
      });

      expect(app.get("config").cssFiles).toEqual(["user/css/index.css"]);
      expect(app.get("config").jsFiles).toEqual(["user/js/index.js"]);
    });

    test("sanitizes all given paths by the user", () => {
      const app = require("express")();

      setConfig(app, {
        projectName: "userName",
        srcFolder: "/user/srcFolder",
        cssFiles: "./user/css/index.css",
        jsFiles: "/user/js/index.js"
      });

      expect(app.get("config").cssFiles).toEqual(["user/css/index.css"]);
      expect(app.get("config").jsFiles).toEqual(["user/js/index.js"]);
    });
  });

  describe("with arrays for user cssFiles and user jsFiles", () => {
    test("merges given user config and app config and sets app.config", () => {
      const app = require("express")();

      setConfig(app, {
        projectName: "userName",
        srcFolder: "user/srcFolder/",
        cssFiles: ["user/css/index.css"],
        jsFiles: ["user/js/index.js"]
      });

      expect(app.get("config").cssFiles).toEqual(["user/css/index.css"]);
      expect(app.get("config").jsFiles).toEqual(["user/js/index.js"]);
    });

    test("sanitizes all given paths by the user", () => {
      const app = require("express")();

      setConfig(app, {
        projectName: "userName",
        srcFolder: "/user/srcFolder",
        cssFiles: ["./user/css/index.css"],
        jsFiles: ["/user/js/index.js"]
      });

      expect(app.get("config").cssFiles).toEqual(["user/css/index.css"]);
      expect(app.get("config").jsFiles).toEqual(["user/js/index.js"]);
    });
  });

  describe("with an object for user cssFiles and user jsFiles", () => {
    describe("values are arrays", () => {
      test("merges given user config and app config and sets app.config", () => {
        const app = require("express")();

        setConfig(app, {
          projectName: "userName",
          srcFolder: "user/srcFolder/",
          cssFiles: {
            test: ["user/dev/css/index.css"]
          },
          jsFiles: {
            test: ["user/dev/js/index.js"]
          }
        });

        expect(app.get("config").cssFiles).toEqual(["user/dev/css/index.css"]);
        expect(app.get("config").jsFiles).toEqual(["user/dev/js/index.js"]);
      });

      test("sanitizes all given paths by the user", () => {
        const app = require("express")();

        setConfig(app, {
          projectName: "userName",
          srcFolder: "/user/srcFolder",
          cssFiles: ["./user/css/index.css"],
          jsFiles: ["/user/js/index.js"]
        });

        expect(app.get("config").cssFiles).toEqual(["user/css/index.css"]);
        expect(app.get("config").jsFiles).toEqual(["user/js/index.js"]);
      });
    });

    describe("values are strings", () => {
      test("merges given user config and app config and sets app.config", () => {
        const app = require("express")();

        setConfig(app, {
          projectName: "userName",
          srcFolder: "user/srcFolder/",
          cssFiles: {
            test: "user/dev/css/index.css"
          },
          jsFiles: {
            test: "user/dev/js/index.js"
          }
        });

        expect(app.get("config").cssFiles).toEqual(["user/dev/css/index.css"]);
        expect(app.get("config").jsFiles).toEqual(["user/dev/js/index.js"]);
      });

      test("sanitizes all given paths by the user", () => {
        const app = require("express")();

        setConfig(app, {
          projectName: "userName",
          srcFolder: "/user/srcFolder",
          cssFiles: "./user/css/index.css",
          jsFiles: "/user/js/index.js"
        });

        expect(app.get("config").cssFiles).toEqual(["user/css/index.css"]);
        expect(app.get("config").jsFiles).toEqual(["user/js/index.js"]);
      });
    });

    describe("with missing env key in assets objects", () => {
      const app = require("express")();

      test("it logs an error", () => {
        logger.log = jest.fn();

        setConfig(app, {
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

        setConfig(app, {
          cssFiles: {
            foo: ["user/css/index.css"]
          },
          jsFiles: {
            foo: ["user/js/index.js"]
          }
        });
        expect(app.get("config").cssFiles).toEqual([]);
        expect(app.get("config").jsFiles).toEqual([]);
      });
    });
  });

  describe("without any empty config given", () => {
    test("it returns the default values", () => {
      const app = require("express")();

      setConfig(app);

      expect(app.get("config")).toEqual({
        projectName: "headman",
        srcFolder: "",
        buildFolder: "build",
        cssFiles: [],
        jsFiles: [],
        es6Modules: false,
        srcFolderIgnores: [
          "node_modules",
          ".git",
          "package.json",
          "package-lock.json",
          "headman.json"
        ],
        validations: {
          html: true,
          accessibility: true
        },
        reload: true
      });
    });
  });

  describe("with srcFolder === '.'", () => {
    test("it sets srcFolder to ''", () => {
      const app = require("express")();

      setConfig(app, {
        srcFolder: "."
      });

      expect(app.get("config").srcFolder).toEqual("");
    });
  });

  describe("with srcFolder === '/'", () => {
    test("it sets srcFolder to ''", () => {
      const app = require("express")();

      setConfig(app, {
        srcFolder: "/"
      });

      expect(app.get("config").srcFolder).toEqual("");
    });
  });
});
