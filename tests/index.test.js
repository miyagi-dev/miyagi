const appConfig = require("../lib/config.json");
const nodeEnv = process.env.NODE_ENV;

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  process.env.NODE_ENV = nodeEnv;
});

describe("index", () => {
  describe("without process.env.NODE_ENV defined", () => {
    test("returns an error message", () => {
      const logger = require("../lib/logger.js");

      logger.log = jest.fn();
      delete process.env.NODE_ENV;
      require("../index.js");
      expect(logger.log).toHaveBeenCalledWith(
        "error",
        "Please define your NODE_ENV."
      );
    });
  });

  describe("with process.env.NODE_ENV defined", () => {
    describe("with roundup.json", () => {
      describe("with parseable result from roundup.json", () => {
        describe("with extension, srcFolder and engine defined in roundup.json", () => {
          test("calls lib/init with parsed config", () => {
            const fs = require("fs");
            const init = require("../lib/init/index.js");
            const logger = require("../lib/logger.js");
            logger.log = jest.fn();
            jest.mock("../lib/init/index.js");

            fs.readFile = jest.fn((file, encoding, cb) => {
              cb(
                "",
                '{"extension": "hbs","engine": "handlebars","srcFolder": "src/"}'
              );
            });

            require("../index.js");
            expect(init).toHaveBeenCalledWith(
              appConfig,
              JSON.parse(
                '{"extension": "hbs","engine": "handlebars","srcFolder": "src/"}'
              )
            );
          });
        });

        describe("without extension defined in roundup.json", () => {
          test("it calls logger.log with the correct error msg", () => {
            const fs = require("fs");
            const logger = require("../lib/logger.js");

            logger.log = jest.fn();
            fs.readFile = jest.fn((file, encoding, cb) => {
              cb("", '{"engine": "handlebars","srcFolder": "src/"}');
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
            const init = require("../lib/init/index.js");
            jest.mock("../lib/init/index.js");

            logger.log = jest.fn();
            fs.readFile = jest.fn((file, encoding, cb) => {
              cb("", '{"engine": "handlebars","srcFolder": "src/"}');
            });

            require("../index.js");

            expect(init).not.toHaveBeenCalled();
          });
        });

        describe("without engine defined in roundup.json", () => {
          test("it calls logger.log with the correct error msg", () => {
            const fs = require("fs");
            const logger = require("../lib/logger.js");

            logger.log = jest.fn();
            fs.readFile = jest.fn((file, encoding, cb) => {
              cb("", '{"extension": "hbs","srcFolder": "src/"}');
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
            const init = require("../lib/init/index.js");
            jest.mock("../lib/init/index.js");

            logger.log = jest.fn();
            fs.readFile = jest.fn((file, encoding, cb) => {
              cb("", '{"extension": "hbs","srcFolder": "src/"}');
            });

            require("../index.js");

            expect(init).not.toHaveBeenCalled();
          });
        });

        describe("without srcFolfer defined in roundup.json", () => {
          test("it calls logger.log with the correct error msg", () => {
            const fs = require("fs");
            const logger = require("../lib/logger.js");

            logger.log = jest.fn();
            fs.readFile = jest.fn((file, encoding, cb) => {
              cb("", '{"engine": "handlebars","extension": "hbs"}');
            });

            require("../index.js");

            expect(logger.log).toHaveBeenCalledWith(
              "error",
              appConfig.messages.missingSrcFolder
            );
          });

          test("doesn't call lib/init", () => {
            const fs = require("fs");
            const logger = require("../lib/logger.js");
            const init = require("../lib/init/index.js");
            jest.mock("../lib/init/index.js");

            logger.log = jest.fn();
            fs.readFile = jest.fn((file, encoding, cb) => {
              cb("", '{"engine": "handlebars","extension": "hbs"}');
            });

            require("../index.js");

            expect(init).not.toHaveBeenCalled();
          });
        });
      });

      describe("with roundup.json not being parseable", () => {
        test("it calls logger.log with the correct error msg", () => {
          const fs = require("fs");
          const logger = require("../lib/logger.js");

          logger.log = jest.fn();
          fs.readFile = jest.fn((file, encoding, cb) => {
            cb("", "unparseable");
          });

          require("../index.js");

          expect(logger.log).toHaveBeenCalledWith(
            "error",
            "Roundup wasn't able to parse your config file."
          );
        });
      });
    });

    describe("without roundup.json", () => {
      test("it calls logger.log with the correct error msg", () => {
        const fs = require("fs");
        const logger = require("../lib/logger.js");

        logger.log = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", undefined);
        });

        require("../index.js");

        expect(logger.log).toHaveBeenCalledWith(
          "error",
          appConfig.messages.userConfigNotFound
        );
      });
    });
  });
});
