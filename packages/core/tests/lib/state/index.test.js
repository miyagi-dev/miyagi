import express from "express";
import config from "../../../lib/miyagi-config.js";

async function mock() {
  jest.doMock("../../../lib/state/partials.js", () => {
    return {
      __esModule: true,
      getPartials: jest.fn(() => {
        return new Promise((resolve) => resolve([]));
      }),
    };
  });
  jest.doMock("../../../lib/state/file-contents.js", () => {
    return {
      __esModule: true,
      getFileContents: jest.fn(() => {
        return new Promise((resolve) => resolve("data"));
      }),
    };
  });
  jest.doMock("../../../lib/state/menu/index.js", () => {
    return {
      __esModule: true,
      getMenu: jest.fn(() => {
        return "menu";
      }),
    };
  });
  jest.doMock("../../../lib/state/flat-menu.js", () => {
    return {
      __esModule: true,
      default: jest.fn(() => {
        return [];
      }),
    };
  });
  jest.doMock("../../../lib/state/source-tree.js", () => {
    return {
      __esModule: true,
      getSourceTree: jest.fn(() => {
        return "sourceTree";
      }),
    };
  });

  const { getPartials } = await import("../../../lib/state/partials.js");
  const { getFileContents } = await import(
    "../../../lib/state/file-contents.js"
  );
  const { getMenu } = await import("../../../lib/state/menu/index.js");
  const { getSourceTree } = await import("../../../lib/state/source-tree.js");

  return {
    getPartials,
    getFileContents,
    getMenu,
    getSourceTree,
  };
}

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/index", () => {
  describe("with data=false, menu=false, sourceTree=false, partials=false", () => {
    test("calls nothing", async () => {
      const app = express();

      const { getPartials, getFileContents, getMenu, getSourceTree } =
        await mock();
      const setState = await import("../../../lib/state/index.js");

      app.set("config", {
        ...config.defaultUserConfig,
        components: {
          folder: "srcFolder",
          ignores: [],
        },
      });

      await setState.default(app, {});

      expect(getPartials).not.toHaveBeenCalled();
      expect(getFileContents).not.toHaveBeenCalled();
      expect(getMenu).not.toHaveBeenCalled();
      expect(getSourceTree).not.toHaveBeenCalled();
    });

    describe("no state set yet", () => {
      test("sets the state to {}", async () => {
        const app = express();
        const setState = await import("../../../lib/state/index.js");

        app.set("config", {
          ...config.defaultUserConfig,
          folder: "srcFolder",
          ignores: [],
        });

        await setState.default(app, {});

        expect(app.get("state")).toEqual({});
      });
    });

    describe(" state already set set", () => {
      test("returns that state", async () => {
        const app = express();
        const setState = await import("../../../lib/state/index.js");

        app.set("config", {
          ...config.defaultUserConfig,
          folder: "srcFolder",
          ignores: [],
        });
        app.set("state", {
          foo: "bar",
        });

        await setState.default(app, {});

        expect(app.get("state")).toEqual({
          foo: "bar",
        });
      });
    });
  });

  describe("with sourceTree=true", () => {
    test("calls nothing", async () => {
      const app = express();
      const { getSourceTree } = await mock();
      const setState = await import("../../../lib/state/index.js");

      app.set("config", {
        ...config.defaultUserConfig,
        components: {
          folder: "srcFolder",
          ignores: [],
        },
      });

      await setState.default(app, {
        sourceTree: true,
      });

      expect(getSourceTree).toHaveBeenCalledWith(app);
    });
  });

  describe("with partials=true", () => {
    test("calls getPartials", async () => {
      const app = express();
      const { getPartials } = await mock();
      const setState = await import("../../../lib/state/index.js");

      app.set("config", {
        ...config.defaultUserConfig,
        components: {
          folder: "srcFolder",
          ignores: [],
        },
      });

      await setState.default(app, {
        partials: true,
      });

      expect(getPartials).toHaveBeenCalledWith(app);
    });
  });

  describe("with menu=true", () => {
    test("calls getMenu", async () => {
      const app = express();
      const { getMenu } = await mock();
      const setState = await import("../../../lib/state/index.js");

      app.set("config", {
        ...config.defaultUserConfig,
        components: {
          folder: "srcFolder",
          ignores: [],
        },
      });

      await setState.default(app, {
        menu: true,
      });

      expect(getMenu).toHaveBeenCalledWith(app);
    });
  });

  describe("with data being set", () => {
    describe("with data=true", () => {
      test("calls getFileContents", async () => {
        const app = express();
        const { getFileContents } = await mock();
        const setState = await import("../../../lib/state/index.js");

        app.set("config", {
          ...config.defaultUserConfig,
          folder: "srcFolder",
          ignores: [],
        });

        await setState.default(app, {
          fileContents: true,
        });

        expect(getFileContents).toHaveBeenCalledWith(app);
      });
    });

    describe("with data being an object", () => {
      test("calls nothing", async () => {
        const app = express();
        const { getFileContents } = await mock();
        const setState = await import("../../../lib/state/index.js");

        app.set("config", {
          ...config.defaultUserConfig,
          folder: "srcFolder",
          ignores: [],
        });

        await setState.default(app, {
          fileContents: {},
        });

        expect(getFileContents).not.toHaveBeenCalled();
      });
    });
  });

  describe("with sourceTree=true", () => {
    test("calls getSourceTree after getFileContents", async () => {
      const app = express();
      const { getFileContents, getSourceTree } = await mock();
      const setState = await import("../../../lib/state/index.js");

      app.set("config", {
        ...config.defaultUserConfig,
        components: {
          folder: "srcFolder",
          ignores: [],
        },
      });

      await setState.default(app, {
        fileContents: true,
        sourceTree: true,
      });

      expect(getFileContents).toHaveBeenCalledWith(app);
      expect(getSourceTree).toHaveBeenCalledWith(app);
    });
  });

  describe("with data=true, sourceTree=true", () => {
    test("sets app.state after getFileContents and getSourceTree", async () => {
      const app = express();
      const setState = await import("../../../lib/state/index.js");

      app.set("config", {
        ...config.defaultUserConfig,
        components: {
          folder: "srcFolder",
          ignores: [],
        },
      });
      const spy = jest.spyOn(app, "set");

      await setState.default(app, {
        fileContents: true,
        sourceTree: true,
      });

      expect(spy).toHaveBeenCalledWith("state", {
        fileContents: "data",
        sourceTree: "sourceTree",
      });
    });

    describe("with menu=true", () => {
      test("calls getMenu after setting app.state", async () => {
        const app = express();
        const { getFileContents, getSourceTree, getMenu } = await mock();
        const setState = await import("../../../lib/state/index.js");

        app.set("config", {
          ...config.defaultUserConfig,
          folder: "srcFolder",
          ignores: [],
        });
        const spy = jest.spyOn(app, "set");

        await setState.default(app, {
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
          flatMenu: [],
        });
        expect(getMenu).toHaveBeenCalledWith(app);
      });
    });
  });
});
