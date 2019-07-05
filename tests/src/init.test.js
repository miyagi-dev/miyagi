const appConfig = require("../mocks/config.json");
const registerHelpers = require("../../src/hbs/registerHelpers.js");
const registerPartials = require("../../src/hbs/registerPartials.js");
const setConfig = require("../../src/setConfig.js");
const setEngines = require("../../src/setEngines.js");
const setRouter = require("../../src/setRouter.js");
const setState = require("../../src/setState.js");
const setStaticFiles = require("../../src/setStaticFiles.js");
const setViews = require("../../src/setViews.js");
const logger = require("../../src/logger.js");
const handlebars = require("handlebars");
const handlebarsLayouts = require("handlebars-layouts");
const init = require("../../src/init.js");
require("../../src/fileWatcher.js");

jest.mock("../../src/logger.js");
jest.mock("../../src/fileWatcher.js");
jest.mock("../../src/hbs/registerHelpers.js");
jest.mock("../../src/hbs/registerPartials.js");
jest.mock("../../src/setConfig.js");
jest.mock("../../src/setEngines.js");
jest.mock("../../src/setRouter.js");
jest.mock("../../src/setState.js");
jest.mock("../../src/setStaticFiles.js");
jest.mock("../../src/setViews.js");
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

describe("init", () => {
  describe("always", () => {
    test("calls setConfig", async done => {
      await init(
        Object.assign({}, appConfig, { defaultPort: getRandomPort() })
      );
      expect(setConfig).toHaveBeenCalled();
      expect(setEngines).toHaveBeenCalled();
      done();
    });
  });

  describe("setEngines() was successful", () => {
    test("call init methods", async done => {
      setEngines.mockImplementationOnce(() => true);
      const server = await init(
        Object.assign({}, appConfig, { defaultPort: getRandomPort() })
      );
      expect(setState).toHaveBeenCalled();
      expect(setStaticFiles).toHaveBeenCalled();
      expect(setRouter).toHaveBeenCalled();
      expect(setViews).toHaveBeenCalled();
      expect(registerHelpers).toHaveBeenCalled();
      expect(registerPartials.registerAll).toHaveBeenCalled();
      expect(handlebarsLayouts.register).toHaveBeenCalledWith(handlebars);
      server.close();
      done();
    });

    describe("with process.env.PORT set", () => {
      test("sets app.port to process.env.PORT", async done => {
        setEngines.mockImplementationOnce(() => true);
        process.env.PORT = 1234;
        const server = await init(
          Object.assign({}, appConfig, { defaultPort: getRandomPort() })
        );
        expect(logger.log).toHaveBeenCalledWith(
          "info",
          "Running roundup server at http://127.0.0.1:1234."
        );
        server.close();
        done();
      });
    });

    describe("without process.env.PORT set", () => {
      test("logs the correct port", async done => {
        setEngines.mockImplementationOnce(() => true);
        delete process.env.PORT;
        let config = Object.assign({}, appConfig, {
          defaultPort: getRandomPort()
        });
        const server = await init(config);
        expect(logger.log).toHaveBeenCalledWith(
          "info",
          `Running roundup server at http://127.0.0.1:${config.defaultPort}.`
        );
        server.close();
        done();
      });
    });
  });

  describe("setEngines() was not successful", () => {
    test("doesn't call init methods", async done => {
      setEngines.mockImplementationOnce(() => false);
      await init(
        Object.assign({}, appConfig, { defaultPort: getRandomPort() })
      );
      expect(setState).not.toHaveBeenCalled();
      expect(setStaticFiles).not.toHaveBeenCalled();
      expect(setRouter).not.toHaveBeenCalled();
      expect(setViews).not.toHaveBeenCalled();
      expect(registerHelpers).not.toHaveBeenCalled();
      expect(registerPartials.registerAll).not.toHaveBeenCalled();
      expect(handlebarsLayouts.register).not.toHaveBeenCalled();
      expect(logger.log).not.toHaveBeenCalled();
      done();
    });
  });
});
