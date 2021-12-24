import deepMerge from "deepmerge";
import express from "express";
import consolidate from "consolidate";
import engines from "../../../lib/init/engines.js";
import config from "../../../lib/miyagi-config.js";
import log from "../../../lib/logger.js";

jest.mock("../../../lib/logger.js");

describe("lib/init/engines", () => {
  test("it sets the handlebars engine for the hbs extension", () => {
    const app = express();
    app.set("extensions", []);
    app.set(
      "config",
      deepMerge(config.defaultUserConfig, {
        engine: {
          name: "twig",
        },
        files: {
          templates: {
            extension: "twig",
          },
        },
      })
    );
    const spy = jest.spyOn(app, "engine");

    engines(app);

    expect(spy).toHaveBeenCalledWith("hbs", consolidate.handlebars);
  });

  test("it sets the user engine for the user extension", () => {
    const app = express();
    app.set("extensions", []);
    app.set(
      "config",
      deepMerge(config.defaultUserConfig, {
        engine: {
          name: "twig",
        },
        files: {
          templates: {
            extension: "twig",
          },
        },
      })
    );
    const spy = jest.spyOn(app, "engine");

    engines(app);

    expect(spy).toHaveBeenNthCalledWith(2, "twig", consolidate.twig);
  });

  describe("with invalid engine", () => {
    const app = express();
    app.set("extensions", []);
    app.set(
      "config",
      deepMerge(config.defaultUserConfig, {
        engine: {
          name: "invalidEngine",
        },
        files: {
          templates: {
            extension: "twig",
          },
        },
      })
    );

    test("it sets the user engine for the user extension", () => {
      engines(app);

      expect(log).toHaveBeenCalledWith(
        "error",
        "Setting the template engine failed. Are you sure the engine defined in your config file is correct?"
      );
    });
  });

  describe("with a valid engine", () => {
    test("the options param for app.render doesnt not extended with a path and allowInlineIncludes key", () => {
      const app = express();
      app.render = jest.fn();
      app.set("extensions", []);
      app.set(
        "config",
        deepMerge(config.defaultUserConfig, {
          engine: {
            name: "ejs",
          },
          files: {
            templates: {
              extension: "ejs",
            },
          },
        })
      );
      const spy = jest.spyOn(app, "render");
      const func = () => {};

      engines(app);
      app.render("component", {}, func);

      expect(spy).toHaveBeenCalledWith("component", {}, func);
    });
  });
});
