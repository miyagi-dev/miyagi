const userFile = require("./.headman.js");
const appConfig = require("../lib/config.json");
const yargs = require("../lib/init/args.js");
const nodeEnv = process.env.NODE_ENV;
const path = require("path");
const deepMerge = require("deepmerge");

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  process.env.NODE_ENV = nodeEnv;
});

const origProcessCwd = process.cwd();
process.cwd = jest.fn(() => `${origProcessCwd}/tests`);

describe("index", () => {
  describe("start", () => {
    jest.mock("../lib/init/args.js", () => {
      return {
        argv: {
          _: ["start"],
        },
      };
    });

    describe("with parseable result from .headman.js", () => {
      describe("with templates.extension, components.folder and engine.name defined in .headman.js", () => {
        test.only("calls lib/init with parsed config", () => {
          const init = require("../lib/init");
          const log = require("../lib/logger.js");
          jest.mock("../lib/logger");
          jest.mock("../lib/init");

          process.argv = [, , "start"];

          require("../index.js");

          expect(init).toHaveBeenCalledWith(
            deepMerge(appConfig.defaultUserConfig, {
              isBuild: false,
              isGenerator: false,
              engine: {
                name: "handlebars",
              },
              files: {
                templates: {
                  extension: "hbs",
                },
              },
              components: {
                folder: "src/",
              },
            }),
            userFile.plugins
          );
        });
      });

      describe("without extension defined in .headman.js", () => {
        test("it calls log with the correct error msg", () => {
          const log = require("../lib/logger.js");

          jest.mock("../lib/logger");
          jest.mock(
            path.resolve(process.cwd(), appConfig.userConfigFile),
            () => ({
              config: {
                engine: {
                  name: "handlebars",
                },
                components: { folder: "src/" },
              },
            }),
            { virtual: true }
          );

          require("../index.js");

          expect(log).toHaveBeenCalledWith(
            "error",
            appConfig.messages.missingExtension
          );
        });

        test("doesn't call lib/init", () => {
          const log = require("../lib/logger.js");
          const init = require("../lib/init");
          jest.mock("../lib/init");
          jest.mock("../lib/logger");
          jest.mock(
            path.resolve(process.cwd(), appConfig.userConfigFile),
            () => {
              return {
                config: {
                  engine: {
                    name: "handlebars",
                  },
                  components: { folder: "src/" },
                },
              };
            }
          );

          require("../index.js");

          expect(init).not.toHaveBeenCalled();
        });
      });

      describe("without engine defined in .headman.js", () => {
        test("it calls log with the correct error msg", () => {
          const log = require("../lib/logger.js");

          jest.mock("../lib/logger");
          jest.mock(
            path.resolve(process.cwd(), appConfig.userConfigFile),
            () => {
              return {
                config: {
                  files: {
                    templates: {
                      extension: "hbs",
                    },
                  },
                  components: { folder: "src/" },
                },
              };
            }
          );

          require("../index.js");

          expect(log).toHaveBeenCalledWith(
            "error",
            appConfig.messages.missingEngine
          );
        });

        test("doesn't call lib/init", () => {
          const log = require("../lib/logger.js");
          const init = require("../lib/init");
          jest.mock("../lib/init");
          jest.mock("../lib/logger");
          jest.mock(
            path.resolve(process.cwd(), appConfig.userConfigFile),
            () => {
              return {
                config: {
                  files: {
                    templates: {
                      extension: "hbs",
                    },
                  },
                  components: { folder: "src/" },
                },
              };
            }
          );

          require("../index.js");

          expect(init).not.toHaveBeenCalled();
        });
      });

      describe("without components.folder defined in .headman.js", () => {
        test("it calls log with the correct warn msg", () => {
          const log = require("../lib/logger.js");
          jest.mock("../lib/logger");
          jest.mock(
            path.resolve(process.cwd(), appConfig.userConfigFile),
            () => {
              return {
                config: {
                  engine: {
                    name: "handlebars",
                  },
                  files: {
                    templates: {
                      extension: "hbs",
                    },
                  },
                },
              };
            }
          );

          require("../index.js");

          expect(log).toHaveBeenCalledWith(
            "warn",
            appConfig.messages.missingSrcFolder
          );
        });

        test("does call lib/init", () => {
          const log = require("../lib/logger.js");
          const init = require("../lib/init");
          jest.mock("../lib/init");
          jest.mock("../lib/logger");
          jest.mock(
            path.resolve(process.cwd(), appConfig.userConfigFile),
            () => {
              return {
                config: {
                  engine: {
                    name: "handlebars",
                  },
                  files: {
                    templates: {
                      extension: "hbs",
                    },
                  },
                },
              };
            }
          );

          require("../index.js");

          expect(init).toHaveBeenCalled();
        });
      });
    });
  });
});
