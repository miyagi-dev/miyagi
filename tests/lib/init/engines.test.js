const express = require("express");
const engines = require("../../../lib/init/engines.js");
const logger = require("../../../lib/logger.js");
const consolidate = require("consolidate");
const path = require("path");

jest.mock("../../../lib/logger.js");

describe("lib/init/engines", () => {
  test("it sets the handlebars engine for the hbs extension", () => {
    const app = express();
    app.set("config", {
      templates: {
        extension: "twig",
        engine: "twig",
      },
    });
    const spy = jest.spyOn(app, "engine");

    engines(app);

    expect(spy).toHaveBeenCalledWith("hbs", consolidate.handlebars);
  });

  test("it sets the app view engine to hbs", () => {
    const app = express();
    app.set("config", {
      templates: {
        extension: "twig",
        engine: "twig",
      },
    });
    const spy = jest.spyOn(app, "set");

    engines(app);

    expect(spy).toHaveBeenCalledWith("view engine", "hbs");
  });

  test("it sets the user engine for the user extension", () => {
    const app = express();
    app.set("config", {
      templates: {
        extension: "twig",
        engine: "twig",
      },
    });
    const spy = jest.spyOn(app, "engine");

    engines(app);

    expect(spy).toHaveBeenNthCalledWith(2, "twig", consolidate.twig);
  });

  test("it sets the app view engine to the user extension", () => {
    const app = express();
    app.set("config", {
      templates: {
        extension: "twig",
        engine: "twig",
      },
    });
    const spy = jest.spyOn(app, "set");

    engines(app);

    expect(spy).toHaveBeenCalledWith(
      "view engine",
      app.get("config").templates.extension
    );
  });

  describe("with invalid engine", () => {
    const app = express();
    app.set("config", {
      templates: {
        extension: "twig",
        engine: "invalidEngine",
      },
    });

    test("it sets the user engine for the user extension", () => {
      const spy = jest.spyOn(logger, "log");

      engines(app);

      expect(spy).toHaveBeenCalledWith(
        "error",
        "Setting the rendering engine failed. Are you sure the engine defined in your headman.json is correct?"
      );
    });
  });

  describe("with a valid engine", () => {
    test("the options param for app.render doesnt not extended with a path and allowInlineIncludes key", () => {
      const app = express();
      app.render = jest.fn();
      app.set("config", {
        templates: {
          extension: "ejs",
          engine: "ejs",
        },
      });
      const spy = jest.spyOn(app, "render");
      const func = () => {};

      engines(app);
      app.render("component", {}, func);

      expect(spy).toHaveBeenCalledWith("component", {}, func);
    });
  });
});
