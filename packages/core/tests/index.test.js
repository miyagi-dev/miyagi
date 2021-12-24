import path from "path";
import deepMerge from "deepmerge";
import appConfig, { messages } from "../lib/miyagi-config.js";

const nodeEnv = process.env.NODE_ENV;

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  process.env.NODE_ENV = nodeEnv;
});

const origProcessCwd = process.cwd();
process.cwd = () => `${origProcessCwd}/tests`;

describe("index", () => {
  describe("start", () => {
    jest.mock("../lib/init/args.js", () => {
      return {
        argv: {
          _: ["start"],
        },
      };
    });

    describe("with parseable result from .miyagi.js", () => {
      describe("with templates.extension, components.folder and engine.name defined in .miyagi.js", () => {
        test("calls lib/init with parsed config", async () => {
          jest.doMock("../lib/__dirname.js", () => `${process.cwd()}/lib`);
          jest.doMock("../lib/logger.js");
          jest.doMock("../lib/init/index.js", () => {
            return {
              __esModule: true,
              default: jest.fn(),
            };
          });

          process.argv = ["", "", "start"];

          const index = await import("../index.js");
          const init = await import("../lib/init/index.js");

          await index.default();

          const conf = deepMerge(appConfig.defaultUserConfig, {
            isBuild: false,
            isComponentGenerator: false,
            engine: {
              name: "handlebars",
            },
            files: {
              templates: {
                extension: "hbs",
              },
            },
            components: {
              folder: "src",
            },
            userFileName: ".miyagi.js",
          });

          expect(init.default).toHaveBeenCalledTimes(1);
          expect(init.default).toHaveBeenCalledWith(conf);
        });
      });

      describe("without extension defined in .miyagi.js", () => {
        test("it calls log with the correct error msg", async () => {
          jest.doMock("../lib/__dirname.js", () => `${process.cwd()}/lib`);

          jest.doMock("../lib/logger");
          jest.doMock(
            path.resolve(process.cwd(), ".miyagi.js"),
            () => ({
              engine: {
                name: "handlebars",
              },
              components: { folder: "src" },
            }),
            { virtual: true }
          );

          const log = await import("../lib/logger.js");
          const index = await import("../index.js");

          await index.default();

          expect(log.default).toHaveBeenCalledTimes(3);
          expect(log.default).toHaveBeenNthCalledWith(
            1,
            "info",
            messages.serverStarting.replace("{{node_env}}", "test")
          );
          expect(log.default).toHaveBeenNthCalledWith(
            2,
            "info",
            messages.tryingToGuessExtensionBasedOnEngine
          );
          expect(log.default).toHaveBeenNthCalledWith(
            3,
            "warn",
            messages.templateExtensionGuessedBasedOnTemplateEngine.replace(
              "{{extension}}",
              "hbs"
            )
          );
        });

        test("calls lib/init", async () => {
          jest.doMock("../lib/__dirname.js", () => `${process.cwd()}/lib`);
          jest.doMock("../lib/init/index.js", () => {
            return {
              __esModule: true,
              default: jest.fn(),
            };
          });
          jest.doMock("../lib/logger.js");
          jest.doMock("./.miyagi.js", () => {
            return {
              engine: {
                name: "handlebars",
              },
              components: { folder: "src/" },
            };
          });

          const index = await import("../index.js");
          const init = await import("../lib/init/index.js");

          await index.default();

          expect(init.default).toHaveBeenCalledTimes(1);
        });
      });

      describe("without engine defined in .miyagi.js", () => {
        test("it calls log with the correct error msg", async () => {
          jest.doMock("../lib/init/index.js");
          jest.doMock("../lib/logger.js");
          jest.doMock(path.resolve(process.cwd(), ".miyagi.js"), () => {
            return {
              files: {
                templates: {
                  extension: "hbs",
                },
              },
              components: { folder: "src/" },
            };
          });

          const log = await import("../lib/logger.js");

          const index = await import("../index.js");

          await index.default();

          expect(log.default).toHaveBeenCalledTimes(3);
          expect(log.default).toHaveBeenNthCalledWith(
            1,
            "info",
            messages.serverStarting.replace("{{node_env}}", "test")
          );
          expect(log.default).toHaveBeenNthCalledWith(
            2,
            "info",
            messages.tryingToGuessEngineBasedOnExtension
          );
          expect(log.default).toHaveBeenNthCalledWith(
            3,
            "warn",
            messages.engineGuessedBasedOnExtension.replace(
              "{{engine}}",
              "handlebars"
            )
          );
        });

        test("calls lib/init", async () => {
          jest.doMock("../lib/__dirname.js", () => `${process.cwd()}/lib`);
          jest.doMock("../lib/init/index.js", () => {
            return {
              __esModule: true,
              default: jest.fn(),
            };
          });
          jest.doMock("../lib/logger.js");
          jest.doMock(path.resolve(process.cwd(), ".miyagi.js"), () => {
            return {
              files: {
                templates: {
                  extension: "hbs",
                },
              },
              components: { folder: "src/" },
            };
          });

          const index = await import("../index.js");
          const init = await import("../lib/init/index.js");

          await index.default();

          expect(init.default).toHaveBeenCalled();
        });
      });
    });
  });
});
