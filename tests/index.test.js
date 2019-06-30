const config = require("../src/config.json");

beforeEach(() => {
  jest.resetModules();
});

describe("index", () => {
  describe("with roundup.json", () => {
    describe("with extension, srcFolder and engine defined in roundup.json", () => {
      test("calls src/init with parsed config", () => {
        const init = require("../src/init.js");
        const fs = require("fs");

        fs.readFile = jest.fn((file, encoding, cb) => {
          cb(
            "",
            '{"extension": "hbs","engine": "handlebars","srcFolder": "src/"}'
          );
        });
        init.start = jest.fn();

        require("../index.js");

        expect(init.start).toHaveBeenCalled();
      });
    });

    describe("without extension defined in roundup.json", () => {
      test("it calls logger.log with the correct error msg", () => {
        const init = require("../src/init.js");
        const fs = require("fs");
        const logger = require("../src/logger.js");

        logger.log = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"engine": "handlebars","srcFolder": "src/"}');
        });

        require("../index.js");

        expect(logger.log).toHaveBeenCalledWith(
          "error",
          config.messages.missingExtension
        );
      });

      test("doesn't call src/init", () => {
        const init = require("../src/init.js");
        const fs = require("fs");
        const logger = require("../src/logger.js");

        logger.log = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"engine": "handlebars","srcFolder": "src/"}');
        });

        require("../index.js");

        expect(init.start).not.toHaveBeenCalled();
      });
    });

    describe("without engine defined in roundup.json", () => {
      test("it calls logger.log with the correct error msg", () => {
        const init = require("../src/init.js");
        const fs = require("fs");
        const logger = require("../src/logger.js");

        logger.log = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"extension": "hbs","srcFolder": "src/"}');
        });

        require("../index.js");

        expect(logger.log).toHaveBeenCalledWith(
          "error",
          config.messages.missingEngine
        );
      });

      test("doesn't call src/init", () => {
        const init = require("../src/init.js");
        const fs = require("fs");
        const logger = require("../src/logger.js");

        logger.log = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"extension": "hbs","srcFolder": "src/"}');
        });

        require("../index.js");

        expect(init.start).not.toHaveBeenCalled();
      });
    });

    describe("without srcFolfer defined in roundup.json", () => {
      test("it calls logger.log with the correct error msg", () => {
        const init = require("../src/init.js");
        const fs = require("fs");
        const logger = require("../src/logger.js");

        logger.log = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"engine": "handlebars","extension": "hbs"}');
        });

        require("../index.js");

        expect(logger.log).toHaveBeenCalledWith(
          "error",
          config.messages.missingSrcFolder
        );
      });

      test("doesn't call src/init", () => {
        const init = require("../src/init.js");
        const fs = require("fs");
        const logger = require("../src/logger.js");

        logger.log = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"engine": "handlebars","extension": "hbs"}');
        });

        require("../index.js");

        expect(init.start).not.toHaveBeenCalled();
      });
    });
  });

  describe("without roundup.json", () => {
    test("it calls logger.log with the correct error msg", () => {
      const init = require("../src/init.js");
      const fs = require("fs");
      const logger = require("../src/logger.js");

      logger.log = jest.fn();
      init.start = jest.fn();
      fs.readFile = jest.fn((file, encoding, cb) => {
        cb("", undefined);
      });

      require("../index.js");

      expect(logger.log).toHaveBeenCalledWith(
        "error",
        config.messages.userConfigNotFound
      );
    });
  });
});
