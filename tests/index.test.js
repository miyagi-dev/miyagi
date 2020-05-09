const appConfig = require("../lib/config.json");
const yargs = require("../lib/init/args.js");
const nodeEnv = process.env.NODE_ENV;

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  process.env.NODE_ENV = nodeEnv;
});

describe("index", () => {
  describe("start", () => {
    jest.mock("../lib/init/args.js", () => {
      return {
        argv: {
          _: ["start"],
        },
      };
    });

    describe("with parseable result from headman.json", () => {
      describe("with templates.extension, srcFolder and templates.engine defined in headman.json", () => {
        test("calls lib/init with parsed config", () => {
          const fs = require("fs");
          const init = require("../lib/init");
          const logger = require("../lib/logger.js");
          logger.log = jest.fn();
          jest.mock("../lib/init");

          fs.readFile = jest.fn((file, encoding, cb) => {
            cb(
              "",
              '{"templates":{"extension": "hbs","engine": "handlebars"},"srcFolder": "src/"}'
            );
          });

          require("../index.js");

          expect(init).toHaveBeenCalledWith(
            Object.assign(
              {
                projectName: "headman",
                srcFolder: "",
                build: {
                  folder: "build",
                },
                cssFiles: [],
                jsFiles: [],
                projectName: "headman",
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
                isBuild: false,
                isGenerator: false,
              },
              JSON.parse(
                '{"templates":{"extension": "hbs","engine": "handlebars"},"srcFolder": "src/"}'
              )
            )
          );
        });
      });

      describe("without extension defined in headman.json", () => {
        test("it calls logger.log with the correct error msg", () => {
          const fs = require("fs");
          const logger = require("../lib/logger.js");

          logger.log = jest.fn();
          fs.readFile = jest.fn((file, encoding, cb) => {
            cb(
              "",
              '{"templates": {"engine": "handlebars"},"srcFolder": "src/"}'
            );
          });

          require("../index.js");

          expect(logger.log).toHaveBeenCalledWith(
            "error",
            appConfig.messages.missingExtension
          );
        });

        test("doesn't call lib/init", () => {
          const fs = require("fs");
          const logger = require("../lib/logger.js");
          const init = require("../lib/init");
          jest.mock("../lib/init");

          logger.log = jest.fn();
          fs.readFile = jest.fn((file, encoding, cb) => {
            cb(
              "",
              '{"templates": {"engine": "handlebars"},"srcFolder": "src/"}'
            );
          });

          require("../index.js");

          expect(init).not.toHaveBeenCalled();
        });
      });

      describe("without engine defined in headman.json", () => {
        test("it calls logger.log with the correct error msg", () => {
          const fs = require("fs");
          const logger = require("../lib/logger.js");

          logger.log = jest.fn();
          fs.readFile = jest.fn((file, encoding, cb) => {
            cb("", '{"templates":{"extension": "hbs"},"srcFolder": "src/"}');
          });

          require("../index.js");

          expect(logger.log).toHaveBeenCalledWith(
            "error",
            appConfig.messages.missingEngine
          );
        });

        test("doesn't call lib/init", () => {
          const fs = require("fs");
          const logger = require("../lib/logger.js");
          const init = require("../lib/init");
          jest.mock("../lib/init");

          logger.log = jest.fn();
          fs.readFile = jest.fn((file, encoding, cb) => {
            cb("", '{"templates":{"extension": "hbs"},"srcFolder": "src/"}');
          });

          require("../index.js");

          expect(init).not.toHaveBeenCalled();
        });
      });

      describe("without srcFolder defined in headman.json", () => {
        test("it calls logger.log with the correct warn msg", () => {
          const fs = require("fs");
          const logger = require("../lib/logger.js");

          logger.log = jest.fn();
          fs.readFile = jest.fn((file, encoding, cb) => {
            cb("", '{"templates":{"engine": "handlebars","extension": "hbs"}}');
          });

          require("../index.js");

          expect(logger.log).toHaveBeenCalledWith(
            "warn",
            appConfig.messages.missingSrcFolder
          );
        });

        test("does call lib/init", () => {
          const fs = require("fs");
          const logger = require("../lib/logger.js");
          const init = require("../lib/init");
          jest.mock("../lib/init");

          logger.log = jest.fn();
          fs.readFile = jest.fn((file, encoding, cb) => {
            cb("", '{"templates":{"engine": "handlebars","extension": "hbs"}}');
          });

          require("../index.js");

          expect(init).toHaveBeenCalled();
        });
      });
    });

    describe("with headman.json not being parseable", () => {
      test("it calls logger.log with the correct error msg", () => {
        const fs = require("fs");
        const logger = require("../lib/logger.js");

        logger.log = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", "unparseable");
        });

        require("../index.js");

        expect(logger.log).toHaveBeenNthCalledWith(
          2,
          "error",
          "headman wasn't able to parse your config file."
        );
      });
    });
  });
});
