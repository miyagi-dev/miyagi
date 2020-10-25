const path = require("path");
const getMergedConfig = require("../../../lib/init/config.js");
const log = require("../../../lib/logger.js");

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
            name: "README",
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
            name: "README",
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
            name: "README",
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
            name: "README",
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
              name: "README",
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
              name: "README",
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
              name: "README",
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
              name: "README",
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
              name: "README",
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

        expect(log).toHaveBeenNthCalledWith(
          1,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in folders.assets in your config file, so miyagi is not able to deliver your css files."
        );

        expect(log).toHaveBeenNthCalledWith(
          2,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in folders.assets in your config file, so miyagi is not able to deliver your js files."
        );
      });

      test("it sets the asset keys to []", () => {
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
              name: "README",
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
          basePath: "/",
          folder: "build",
          outputFile: false,
        },
        assets: {
          css: [],
          js: [],
          es6Modules: false,
          folder: [],
          manifest: null,
          customProperties: {
            prefixes: {
              color: "color",
              spacing: "spacing",
              typo: "typo",
            },
          },
        },
        components: {
          folder: "src",
          ignores: [
            "node_modules",
            ".git",
            "package.json",
            "package-lock.json",
            ".miyagi.js",
            ".miyagi.json",
          ],
        },
        engine: {
          name: null,
        },
        projectName: "miyagi",
        ui: {
          reloadAfterChanges: {
            componentAssets: false,
          },
          renderComponentOverview: false,
          validations: {
            html: true,
            accessibility: true,
          },
          reload: true,
          theme: {
            mode: "light",
          },
        },
        extensions: [],
        files: {
          css: {
            extension: "css",
            name: "index",
          },
          docs: {
            extension: "md",
            name: "README",
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
        schema: {},
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
              name: "README",
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
              name: "README",
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
