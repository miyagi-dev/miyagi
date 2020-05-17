let express;
let getPartials;
let getFileContents;
let getMenu;
let getSourceTree;
let setState;

const config = require("../../../lib/config.json");

beforeEach(() => {
  express = require("express");
  getPartials = require("../../../lib/state/partials.js");
  /* eslint-disable */
  getFileContents = require("../../../lib/state/file-contents.js")
    .getFileContents;
  getMenu = require("../../../lib/state/menu/index.js").getMenu;
  getSourceTree = require("../../../lib/state/source-tree.js").getSourceTree;
  /* eslint-enable */
  setState = require("../../../lib/state");

  jest.mock("../../../lib/state/partials.js");
  jest.mock("../../../lib/state/file-contents.js", () => {
    return {
      getFileContents: jest.fn(() => {
        return "data";
      }),
    };
  });
  jest.mock("../../../lib/state/menu/index.js", () => {
    return {
      getMenu: jest.fn(() => {
        return "menu";
      }),
    };
  });
  jest.mock("../../../lib/state/source-tree.js", () => {
    return {
      getSourceTree: jest.fn(() => {
        return "sourceTree";
      }),
    };
  });
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/index", () => {
  describe("with data=false, menu=false, sourceTree=false, partials=false", () => {
    test("calls nothing", async (done) => {
      const app = express();
      app.set(
        "config",
        Object.assign({}, config.defaultUserConfig, {
          srcFolder: "srcFolder",
          srcFolderIgnores: [],
        })
      );

      await setState(app, {});

      expect(getPartials).not.toHaveBeenCalled();
      expect(getFileContents).not.toHaveBeenCalled();
      expect(getMenu).not.toHaveBeenCalled();
      expect(getSourceTree).not.toHaveBeenCalled();
      done();
    });

    describe("no state set yet", () => {
      test("sets the state to {}", async (done) => {
        const app = express();
        app.set(
          "config",
          Object.assign({}, config.defaultUserConfig, {
            srcFolder: "srcFolder",
            srcFolderIgnores: [],
          })
        );

        await setState(app, {});

        expect(app.get("state")).toEqual({});
        done();
      });
    });

    describe(" state already set set", () => {
      test("returns that state", async (done) => {
        const app = express();
        app.set(
          "config",
          Object.assign({}, config.defaultUserConfig, {
            srcFolder: "srcFolder",
            srcFolderIgnores: [],
          })
        );
        app.set("state", {
          foo: "bar",
        });

        await setState(app, {});

        expect(app.get("state")).toEqual({
          foo: "bar",
        });
        done();
      });
    });
  });

  describe("with sourceTree=true", () => {
    test("calls nothing", async (done) => {
      const app = express();
      app.set(
        "config",
        Object.assign({}, config.defaultUserConfig, {
          srcFolder: "srcFolder",
          srcFolderIgnores: [],
        })
      );

      await setState(app, {
        sourceTree: true,
      });

      expect(getSourceTree).toHaveBeenCalledWith(app);
      done();
    });
  });

  describe("with partials=true", () => {
    test("calls getPartials", async (done) => {
      const app = express();
      app.set(
        "config",
        Object.assign({}, config.defaultUserConfig, {
          srcFolder: "srcFolder",
          srcFolderIgnores: [],
        })
      );

      await setState(app, {
        partials: true,
      });

      expect(getPartials).toHaveBeenCalledWith(app);
      done();
    });
  });

  describe("with menu=true", () => {
    test("calls getMenu", async (done) => {
      const app = express();
      app.set(
        "config",
        Object.assign({}, config.defaultUserConfig, {
          srcFolder: "srcFolder",
          srcFolderIgnores: [],
        })
      );

      await setState(app, {
        menu: true,
      });

      expect(getMenu).toHaveBeenCalledWith(app);
      done();
    });
  });

  describe("with data being set", () => {
    describe("with data=true", () => {
      test("calls getFileContents", async (done) => {
        const app = express();
        app.set(
          "config",
          Object.assign({}, config.defaultUserConfig, {
            srcFolder: "srcFolder",
            srcFolderIgnores: [],
          })
        );

        await setState(app, {
          fileContents: true,
        });

        expect(getFileContents).toHaveBeenCalledWith(app);
        done();
      });
    });

    describe("with data being an object", () => {
      test("calls nothing", async (done) => {
        const app = express();
        app.set(
          "config",
          Object.assign({}, config.defaultUserConfig, {
            srcFolder: "srcFolder",
            srcFolderIgnores: [],
          })
        );

        await setState(app, {
          fileContents: {},
        });

        expect(getFileContents).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe("with sourceTree=true", () => {
    test("calls getSourceTree after getFileContents", async (done) => {
      const app = express();
      app.set(
        "config",
        Object.assign({}, config.defaultUserConfig, {
          srcFolder: "srcFolder",
          srcFolderIgnores: [],
        })
      );

      await setState(app, {
        fileContents: true,
        sourceTree: true,
      });

      expect(getFileContents).toHaveBeenCalledWith(app);
      expect(getSourceTree).toHaveBeenCalledWith(app);
      done();
    });
  });

  describe("with data=true, sourceTree=true", () => {
    test("sets app.state after getFileContents and getSourceTree", async (done) => {
      const app = express();
      app.set(
        "config",
        Object.assign({}, config.defaultUserConfig, {
          srcFolder: "srcFolder",
          srcFolderIgnores: [],
        })
      );
      const spy = jest.spyOn(app, "set");

      await setState(app, {
        fileContents: true,
        sourceTree: true,
      });

      expect(spy).toHaveBeenCalledWith("state", {
        fileContents: "data",
        sourceTree: "sourceTree",
      });
      done();
    });

    describe("with menu=true", () => {
      test("calls getMenu after setting app.state", async (done) => {
        const app = express();
        app.set(
          "config",
          Object.assign({}, config.defaultUserConfig, {
            srcFolder: "srcFolder",
            srcFolderIgnores: [],
          })
        );
        const spy = jest.spyOn(app, "set");

        await setState(app, {
          fileContents: true,
          sourceTree: true,
          menu: true,
        });

        expect(getFileContents).toHaveBeenCalledWith(app);
        expect(getSourceTree).toHaveBeenCalledWith(app);
        expect(spy).toHaveBeenCalledWith("state", {
          fileContents: "data",
          sourceTree: "sourceTree",
          menu: "menu",
        });
        expect(getMenu).toHaveBeenCalledWith(app);
        done();
      });
    });
  });
});
