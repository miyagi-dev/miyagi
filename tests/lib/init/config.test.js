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
        components: {
          folder: "user/srcFolder/",
        },
        assets: {
          css: "user/css/index.css",
          js: "user/js/index.js",
        },
        files: {
          css: {
            extension: "css",
            name: "index",
          },
          docs: {
            extension: "md",
            name: "docs",
          },
          js: {
            extension: "js",
            name: "index",
          },
          mocks: {
            extension: "json",
            name: "mocks",
          },
          schema: {
            extension: "json",
            name: "schema",
          },
          templates: {
            name: "index",
          },
        },
      });

      expect(conf.assets.css).toEqual(["user/css/index.css"]);
      expect(conf.assets.js).toEqual(["user/js/index.js"]);
    });

    test("sanitizes all given paths by the user", () => {
      const conf = getMergedConfig({
        projectName: "userName",
        components: { folder: "/user/srcFolder" },
        assets: {
          css: "./user/css/index.css",
          js: "/user/js/index.js",
        },
        files: {
          css: {
            extension: "css",
            name: "index",
          },
          docs: {
            extension: "md",
            name: "docs",
          },
          js: {
            extension: "js",
            name: "index",
          },
          mocks: {
            extension: "json",
            name: "mocks",
          },
          schema: {
            extension: "json",
            name: "schema",
          },
          templates: {
            name: "index",
          },
        },
      });

      expect(conf.assets.css).toEqual(["user/css/index.css"]);
      expect(conf.assets.js).toEqual(["user/js/index.js"]);
    });
  });

  describe("with arrays for user cssFiles and user jsFiles", () => {
    test("merges given user config and app config and returns it", () => {
      const conf = getMergedConfig({
        projectName: "userName",
        components: {
          folder: "user/srcFolder/",
        },
        assets: {
          css: ["user/css/index.css"],
          js: ["user/js/index.js"],
        },
        files: {
          css: {
            extension: "css",
            name: "index",
          },
          docs: {
            extension: "md",
            name: "docs",
          },
          js: {
            extension: "js",
            name: "index",
          },
          mocks: {
            extension: "json",
            name: "mocks",
          },
          schema: {
            extension: "json",
            name: "schema",
          },
          templates: {
            name: "index",
          },
        },
      });

      expect(conf.assets.css).toEqual(["user/css/index.css"]);
      expect(conf.assets.js).toEqual(["user/js/index.js"]);
    });

    test("sanitizes all given paths by the user", () => {
      const conf = getMergedConfig({
        projectName: "userName",
        components: { folder: "/user/srcFolder" },
        assets: {
          css: ["./user/css/index.css"],
          js: ["/user/js/index.js"],
        },
        files: {
          css: {
            extension: "css",
            name: "index",
          },
          docs: {
            extension: "md",
            name: "docs",
          },
          js: {
            extension: "js",
            name: "index",
          },
          mocks: {
            extension: "json",
            name: "mocks",
          },
          schema: {
            extension: "json",
            name: "schema",
          },
          templates: {
            name: "index",
          },
        },
      });

      expect(conf.assets.css).toEqual(["user/css/index.css"]);
      expect(conf.assets.js).toEqual(["user/js/index.js"]);
    });
  });

  describe("with an object for user cssFiles and user jsFiles", () => {
    describe("values are arrays", () => {
      test("merges given user config and app config and returns it", () => {
        const conf = getMergedConfig({
          projectName: "userName",
          components: {
            folder: "user/srcFolder/",
          },
          assets: {
            css: {
              test: ["user/dev/css/index.css"],
            },
            js: {
              test: ["user/dev/js/index.js"],
            },
          },
          files: {
            css: {
              extension: "css",
              name: "index",
            },
            docs: {
              extension: "md",
              name: "docs",
            },
            js: {
              extension: "js",
              name: "index",
            },
            mocks: {
              extension: "json",
              name: "mocks",
            },
            schema: {
              extension: "json",
              name: "schema",
            },
            templates: {
              name: "index",
            },
          },
        });

        expect(conf.assets.css).toEqual(["user/dev/css/index.css"]);
        expect(conf.assets.js).toEqual(["user/dev/js/index.js"]);
      });

      test("sanitizes all given paths by the user", () => {
        const conf = getMergedConfig({
          projectName: "userName",
          components: { folder: "/user/srcFolder" },
          assets: {
            css: ["./user/css/index.css"],
            js: ["/user/js/index.js"],
          },
          files: {
            css: {
              extension: "css",
              name: "index",
            },
            docs: {
              extension: "md",
              name: "docs",
            },
            js: {
              extension: "js",
              name: "index",
            },
            mocks: {
              extension: "json",
              name: "mocks",
            },
            schema: {
              extension: "json",
              name: "schema",
            },
            templates: {
              name: "index",
            },
          },
        });

        expect(conf.assets.css).toEqual(["user/css/index.css"]);
        expect(conf.assets.js).toEqual(["user/js/index.js"]);
      });
    });

    describe("values are strings", () => {
      test("merges given user config and app config and returns it", () => {
        const conf = getMergedConfig({
          projectName: "userName",
          components: {
            folder: "user/srcFolder/",
          },
          assets: {
            css: {
              test: "user/dev/css/index.css",
            },
            js: {
              test: "user/dev/js/index.js",
            },
          },
          files: {
            css: {
              extension: "css",
              name: "index",
            },
            docs: {
              extension: "md",
              name: "docs",
            },
            js: {
              extension: "js",
              name: "index",
            },
            mocks: {
              extension: "json",
              name: "mocks",
            },
            schema: {
              extension: "json",
              name: "schema",
            },
            templates: {
              name: "index",
            },
          },
        });

        expect(conf.assets.css).toEqual(["user/dev/css/index.css"]);
        expect(conf.assets.js).toEqual(["user/dev/js/index.js"]);
      });

      test("sanitizes all given paths by the user", () => {
        const conf = getMergedConfig({
          projectName: "userName",
          components: { folder: "/user/srcFolder" },
          assets: {
            css: "./user/css/index.css",
            js: "/user/js/index.js",
          },
          files: {
            css: {
              extension: "css",
              name: "index",
            },
            docs: {
              extension: "md",
              name: "docs",
            },
            js: {
              extension: "js",
              name: "index",
            },
            mocks: {
              extension: "json",
              name: "mocks",
            },
            schema: {
              extension: "json",
              name: "schema",
            },
            templates: {
              name: "index",
            },
          },
        });

        expect(conf.assets.css).toEqual(["user/css/index.css"]);
        expect(conf.assets.js).toEqual(["user/js/index.js"]);
      });
    });

    describe("with missing env key in assets objects", () => {
      test("it logs an error", () => {
        logger.log = jest.fn();

        getMergedConfig({
          assets: {
            css: {
              foo: ["user/css/index.css"],
            },
            js: {
              foo: ["user/js/index.js"],
            },
          },
          files: {
            css: {
              extension: "css",
              name: "index",
            },
            docs: {
              extension: "md",
              name: "docs",
            },
            js: {
              extension: "js",
              name: "index",
            },
            mocks: {
              extension: "json",
              name: "mocks",
            },
            schema: {
              extension: "json",
              name: "schema",
            },
            templates: {
              name: "index",
            },
          },
        });

        expect(logger.log).toHaveBeenNthCalledWith(
          1,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in folders.assets in your .headman.js, so headman is not able to deliver your css files."
        );

        expect(logger.log).toHaveBeenNthCalledWith(
          2,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in folders.assets in your .headman.js, so headman is not able to deliver your js files."
        );
      });

      test("it sets the asset keys to []", () => {
        logger.log = jest.fn();

        const conf = getMergedConfig({
          assets: {
            css: {
              foo: ["user/css/index.css"],
            },
            js: {
              foo: ["user/js/index.js"],
            },
          },
          files: {
            css: {
              extension: "css",
              name: "index",
            },
            docs: {
              extension: "md",
              name: "docs",
            },
            js: {
              extension: "js",
              name: "index",
            },
            mocks: {
              extension: "json",
              name: "mocks",
            },
            schema: {
              extension: "json",
              name: "schema",
            },
            templates: {
              name: "index",
            },
          },
        });
        expect(conf.assets.css).toEqual([]);
        expect(conf.assets.js).toEqual([]);
      });
    });
  });

  describe("without any empty config given", () => {
    test("it returns the default values", () => {
      expect(getMergedConfig({ files: { templates: {} } })).toEqual({
        build: {
          folder: "build",
        },
        assets: {
          css: [],
          js: [],
          es6Modules: false,
        },
        components: {
          folder: "",
          ignores: [
            "node_modules",
            ".git",
            "package.json",
            "package-lock.json",
            ".headman.js",
          ],
        },
        engine: {
          name: null,
        },
        projectName: "headman",
        ui: {
          validations: {
            html: true,
            accessibility: true,
          },
          reload: true,
        },
        files: {
          css: {
            extension: "css",
            name: "index",
          },
          docs: {
            extension: "md",
            name: "docs",
          },
          info: {
            extension: "json",
            name: "info",
          },
          js: {
            extension: "js",
            name: "index",
          },
          mocks: {
            extension: "json",
            name: "mocks",
          },
          schema: {
            extension: "json",
            name: "schema",
          },
          templates: {
            name: "index",
          },
        },
      });
    });
  });

  describe("with components.folder === '.'", () => {
    test("it sets components.folder to ''", () => {
      expect(
        getMergedConfig({
          components: {
            folder: ".",
          },
          files: {
            css: {
              extension: "css",
              name: "index",
            },
            docs: {
              extension: "md",
              name: "docs",
            },
            js: {
              extension: "js",
              name: "index",
            },
            mocks: {
              extension: "json",
              name: "mocks",
            },
            schema: {
              extension: "json",
              name: "schema",
            },
            templates: {
              name: "index",
            },
          },
        }).components.folder
      ).toEqual("");
    });
  });

  describe("with components.folder === '/'", () => {
    test("it sets components.folder to ''", () => {
      expect(
        getMergedConfig({
          components: {
            folder: "/",
          },
          files: {
            css: {
              extension: "css",
              name: "index",
            },
            docs: {
              extension: "md",
              name: "docs",
            },
            js: {
              extension: "js",
              name: "index",
            },
            mocks: {
              extension: "json",
              name: "mocks",
            },
            schema: {
              extension: "json",
              name: "schema",
            },
            templates: {
              name: "index",
            },
          },
        }).components.folder
      ).toEqual("");
    });
  });
});
