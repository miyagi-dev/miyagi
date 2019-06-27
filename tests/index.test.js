const config = require("../src/config.json");

describe("index", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("with roundup.json", () => {
    beforeEach(() => {
      jest.resetModules();
    });

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
      test("it calls console.log with the correct error msg", () => {
        const init = require("../src/init.js");
        const fs = require("fs");

        console.error = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"engine": "handlebars","srcFolder": "src/"}');
        });

        require("../index.js");

        expect(console.error).toHaveBeenCalledWith(
          config.messages.missingFileExtension
        );
      });

      test("doesn't call src/init", () => {
        const init = require("../src/init.js");
        const fs = require("fs");

        console.error = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"engine": "handlebars","srcFolder": "src/"}');
        });

        require("../index.js");

        expect(init.start).not.toHaveBeenCalled();
      });
    });

    describe("without engine defined in roundup.json", () => {
      test("it calls console.log with the correct error msg", () => {
        const init = require("../src/init.js");
        const fs = require("fs");

        console.error = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"extension": "hbs","srcFolder": "src/"}');
        });

        require("../index.js");

        expect(console.error).toHaveBeenCalledWith(
          config.messages.missingEngine
        );
      });

      test("doesn't call src/init", () => {
        const init = require("../src/init.js");
        const fs = require("fs");

        console.error = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"extension": "hbs","srcFolder": "src/"}');
        });

        require("../index.js");

        expect(init.start).not.toHaveBeenCalled();
      });
    });

    describe("without srcFolfer defined in roundup.json", () => {
      test("it calls console.log with the correct error msg", () => {
        const init = require("../src/init.js");
        const fs = require("fs");

        console.error = jest.fn();
        init.start = jest.fn();
        fs.readFile = jest.fn((file, encoding, cb) => {
          cb("", '{"engine": "handlebars","extension": "hbs"}');
        });

        require("../index.js");

        expect(console.error).toHaveBeenCalledWith(
          config.messages.missingComponentLocation
        );
      });

      test("doesn't call src/init", () => {
        const init = require("../src/init.js");
        const fs = require("fs");

        console.error = jest.fn();
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
    test("it calls console.log with the correct error msg", () => {
      const init = require("../src/init.js");
      const fs = require("fs");

      console.error = jest.fn();
      init.start = jest.fn();
      fs.readFile = jest.fn((file, encoding, cb) => {
        cb("", undefined);
      });

      require("../index.js");

      expect(console.error).toHaveBeenCalledWith(
        config.messages.roundupJsonNotFound
      );
    });
  });
});
