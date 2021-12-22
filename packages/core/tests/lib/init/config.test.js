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
          customProperties: {
            files: ["user/css/custom-props.css"],
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

      expect(conf.assets.css).toEqual(["user/css/index.css"]);
      expect(conf.assets.js).toEqual([
        {
          src: "user/js/index.js",
          async: false,
          defer: false,
          type: null,
          position: "head",
        },
      ]);
      expect(conf.assets.customProperties.files).toEqual([
        "user/css/custom-props.css",
      ]);
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
      expect(conf.assets.js).toEqual([
        {
          src: "user/js/index.js",
          async: false,
          defer: false,
          type: null,
          position: "head",
        },
      ]);
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
      expect(conf.assets.js).toEqual([
        {
          src: "user/js/index.js",
          async: false,
          defer: false,
          type: null,
          position: "head",
        },
      ]);
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
      expect(conf.assets.js).toEqual([
        {
          src: "user/js/index.js",
          async: false,
          defer: false,
          type: null,
          position: "head",
        },
      ]);
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
        expect(conf.assets.js).toEqual([
          {
            src: "user/dev/js/index.js",
            async: false,
            defer: false,
            type: null,
            position: "head",
          },
        ]);
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
        expect(conf.assets.js).toEqual([
          {
            src: "user/js/index.js",
            async: false,
            defer: false,
            type: null,
            position: "head",
          },
        ]);
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
        expect(conf.assets.js).toEqual([
          {
            src: "user/dev/js/index.js",
            async: false,
            defer: false,
            type: null,
            position: "head",
          },
        ]);
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
        expect(conf.assets.js).toEqual([
          {
            src: "user/js/index.js",
            async: false,
            defer: false,
            type: null,
            position: "head",
          },
        ]);
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
            folder: {
              foo: ["folder"],
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
          "Your NODE_ENV 'test' doesn't match the keys you defined in assets.folder in your config file, so miyagi is not able to serve your assets."
        );

        expect(log).toHaveBeenNthCalledWith(
          2,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in assets.css in your config file, so miyagi is not able to serve your css files."
        );

        expect(log).toHaveBeenNthCalledWith(
          3,
          "warn",
          "Your NODE_ENV 'test' doesn't match the keys you defined in assets.js in your config file, so miyagi is not able to serve your js files."
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
          folder: [],
          manifest: null,
          customProperties: {
            files: [],
            prefixes: {
              color: "color",
              spacing: "spacing",
              typo: "typo",
            },
          },
          root: "",
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
          lang: "en",
          textDirection: "ltr",
          renderInIframe: {
            default: false,
            except: [],
          },
        },
        engine: {
          name: null,
        },
        projectName: "miyagi",
        ui: {
          reloadAfterChanges: {
            componentAssets: false,
          },
          validations: {
            html: true,
            accessibility: true,
          },
          reload: true,
          textDirection: "ltr",
          theme: {
            mode: "light",
            dark: {
              content: {
                colorBackground: "var(--Miyagi-color-Background-internal)",
                colorHeadline1: "var(--Miyagi-colorHeadline1-internal)",
                colorHeadline2: "var(--Miyagi-colorHeadline2-internal)",
                colorText: "var(--Miyagi-color-Text-internal)",
              },
              navigation: {
                colorBackground: "var(--Miyagi-color-Background-internal)",
                colorLinks: "var(--Miyagi-color-Link-internal)",
                colorLinksActive: "var(--Miyagi-color-Link-active-internal)",
                colorLinksActiveBackground:
                  "var(--Miyagi-color-Link-active-background-internal)",
                colorSearchBackground:
                  "var(--Miyagi-color-Search-background-internal)",
                colorSearchBorder: "var(--Miyagi-color-Search-border-internal)",
                colorSearchText: "var(--Miyagi-color-Search-text-internal)",
                colorText: "var(--Miyagi-color-Text-internal)",
              },
            },
            light: {
              content: {
                colorBackground: "var(--Miyagi-color-Background-internal)",
                colorHeadline1: "var(--Miyagi-colorHeadline1-internal)",
                colorHeadline2: "var(--Miyagi-colorHeadline2-internal)",
                colorText: "var(--Miyagi-color-Text-internal)",
              },
              navigation: {
                colorBackground: "var(--Miyagi-color-Background-internal)",
                colorLinks: "var(--Miyagi-color-Link-internal)",
                colorLinksActive: "var(--Miyagi-color-Link-active-internal)",
                colorLinksActiveBackground:
                  "var(--Miyagi-color-Link-active-background-internal)",
                colorSearchBackground:
                  "var(--Miyagi-color-Search-background-internal)",
                colorSearchBorder: "var(--Miyagi-color-Search-border-internal)",
                colorSearchText: "var(--Miyagi-color-Search-text-internal)",
                colorText: "var(--Miyagi-color-Text-internal)",
              },
            },
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
