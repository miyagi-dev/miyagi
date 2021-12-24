import handlebars from "handlebars";
import handlebarsLayouts from "handlebars-layouts";
import appConfig from "../../../lib/miyagi-config.js";
import log from "../../../lib/logger.js";
import setEngines from "../../../lib/init/engines.js";
import setPartials from "../../../lib/init/partials.js";
import setRouter from "../../../lib/init/router.js";
import setState from "../../../lib/state/index.js";
import setStatic from "../../../lib/init/static.js";
import setViewHelpers from "../../../lib/init/view-helpers.js";
import setViews from "../../../lib/init/views.js";
import init from "../../../lib/init/index.js";

appConfig.defaultPort += 1;

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
jest.mock("../../../lib/__dirname.js", () => `${process.cwd()}/lib`);
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
    test("calls setEngines", async () => {
      await init({});
      expect(setEngines).toHaveBeenCalled();
    });
  });

  describe("setEngines() was successful", () => {
    test("call init methods", async () => {
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
    });

    describe("with process.env.PORT set", () => {
      test("sets app.port to process.env.PORT", async () => {
        setEngines.mockImplementationOnce(() => true);
        process.env.PORT = 1234;
        const server = await init({});
        expect(log).toHaveBeenCalledWith(
          "success",
          "Running miyagi server at http://localhost:1234!\n"
        );
        server.close();
      });
    });

    describe("without process.env.PORT set", () => {
      test("logs the correct port", async () => {
        setEngines.mockImplementationOnce(() => true);
        delete process.env.PORT;
        const server = await init({});
        expect(log).toHaveBeenCalledWith(
          "success",
          `Running miyagi server at http://localhost:${appConfig.defaultPort}!\n`
        );
        server.close();
      });
    });
  });

  describe("setEngines() was not successful", () => {
    test("doesn't call init methods", async () => {
      setEngines.mockImplementationOnce(() => false);
      await init({ ...appConfig, defaultPort: getRandomPort() });
      expect(setState).not.toHaveBeenCalled();
      expect(setStatic).not.toHaveBeenCalled();
      expect(setRouter).not.toHaveBeenCalled();
      expect(setViews).not.toHaveBeenCalled();
      expect(setViewHelpers).not.toHaveBeenCalled();
      expect(setPartials.registerAll).not.toHaveBeenCalled();
      expect(handlebarsLayouts.register).not.toHaveBeenCalled();
      expect(log).not.toHaveBeenCalled();
    });
  });
});
