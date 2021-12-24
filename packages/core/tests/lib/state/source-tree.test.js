import deepMerge from "deepmerge";
import dirTree from "directory-tree";
import config from "../../../lib/miyagi-config.js";
import { getSourceTree } from "../../../lib/state/source-tree.js";

jest.mock("../../../lib/logger.js");
jest.mock("directory-tree");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/source-tree", () => {
  const app = require("express")();
  app.set(
    "config",
    deepMerge(config.defaultUserConfig, {
      components: {
        ignores: ["/ignoredFolder"],
        folder: "userFolder",
      },
      files: {
        templates: {
          extension: "extension",
        },
      },
    })
  );

  test("getSourceTree() calls dirTree()", () => {
    dirTree.mockImplementationOnce(() => {});

    getSourceTree(app);

    expect(dirTree).toHaveBeenCalledWith(`${process.cwd()}/userFolder`, {
      attributes: ["type"],
      extensions: new RegExp(".(css|md|js|json|json|extension)$"),
      exclude: [
        new RegExp("node_modules"),
        new RegExp(".git"),
        new RegExp("package.json"),
        new RegExp("package-lock.json"),
        new RegExp(".miyagi.js"),
        new RegExp(".miyagi.json"),
        new RegExp("/ignoredFolder"),
      ],
    });
  });

  test("getSourceTree() returns an object with the sourceTree", () => {
    const result = {
      foo: "bar",
    };

    dirTree.mockImplementationOnce(() => result);

    expect(getSourceTree(app)).toEqual(result);
  });
});
