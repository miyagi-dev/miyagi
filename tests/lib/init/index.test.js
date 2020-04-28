const appConfig = require("../../../lib/config.json");
appConfig.defaultPort = appConfig.defaultPort + 1;

const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");
const logger = require("../../../lib/logger.js");
const setConfig = require("../../../lib/init/config.js");
const setEngines = require("../../../lib/init/engines.js");
const setPartials = require("../../../lib/init/partials.js");
const setRouter = require("../../../lib/init/router.js");
const setState = require("../../../lib/state");
const setStatic = require("../../../lib/init/static.js");
const setViewHelpers = require("../../../lib/init/view-helpers.js");
const setViews = require("../../../lib/init/views.js");
const init = require("../../../lib/init");
require("../../../lib/init/watcher.js");

jest.mock("../../../lib/logger.js");
jest.mock("../../../lib/init/config.js");
jest.mock("../../../lib/init/engines.js");
jest.mock("../../../lib/init/partials.js");
jest.mock("../../../lib/init/router.js");
jest.mock("../../../lib/init/static.js");
jest.mock("../../../lib/init/view-helpers.js");
jest.mock("../../../lib/init/views.js");
jest.mock("../../../lib/init/watcher.js");
jest.mock("../../../lib/state");
jest.mock("handlebars");
jest.mock("handlebars-layouts");

function getRandomPort() {
  return Math.floor(Math.random() * (65536 + 1));
}

beforeEach(() => {
  process.env.PORT = getRandomPort();
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  process.env.PORT = undefined;
});

describe("lib/init", () => {
  describe("always", () => {
    test("calls setEngines", async (done) => {
      await init({});
      expect(setEngines).toHaveBeenCalled();
      done();
    });
  });

  describe("setEngines() was successful", () => {
    test("call init methods", async (done) => {
      setEngines.mockImplementationOnce(() => true);
      const server = await init({});
      expect(setState).toHaveBeenCalled();
      expect(setStatic).toHaveBeenCalled();
      expect(setRouter).toHaveBeenCalled();
      expect(setViews).toHaveBeenCalled();
      expect(setViewHelpers).toHaveBeenCalled();
      expect(setPartials.registerAll).toHaveBeenCalled();
      expect(handlebarsLayouts.register).toHaveBeenCalledWith(handlebars);
      server.close();
      done();
    });

    describe("with process.env.PORT set", () => {
      test("sets app.port to process.env.PORT", async (done) => {
        setEngines.mockImplementationOnce(() => true);
        process.env.PORT = 1234;
        const server = await init({});
        expect(logger.log).toHaveBeenCalledWith(
          "info",
          "Running headman server at http://127.0.0.1:1234."
        );
        server.close();
        done();
      });
    });

    describe("without process.env.PORT set", () => {
      test("logs the correct port", async (done) => {
        setEngines.mockImplementationOnce(() => true);
        delete process.env.PORT;
        const server = await init({});
        expect(logger.log).toHaveBeenCalledWith(
          "info",
          `Running headman server at http://127.0.0.1:${appConfig.defaultPort}.`
        );
        server.close();
        done();
      });
    });
  });

  describe("setEngines() was not successful", () => {
    test("doesn't call init methods", async (done) => {
      setEngines.mockImplementationOnce(() => false);
      await init(
        Object.assign({}, appConfig, { defaultPort: getRandomPort() })
      );
      expect(setState).not.toHaveBeenCalled();
      expect(setStatic).not.toHaveBeenCalled();
      expect(setRouter).not.toHaveBeenCalled();
      expect(setViews).not.toHaveBeenCalled();
      expect(setViewHelpers).not.toHaveBeenCalled();
      expect(setPartials.registerAll).not.toHaveBeenCalled();
      expect(handlebarsLayouts.register).not.toHaveBeenCalled();
      expect(logger.log).not.toHaveBeenCalled();
      done();
    });
  });
});
