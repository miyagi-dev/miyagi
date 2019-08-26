const { getSourceTree } = require("../../../lib/state/source-tree.js");
const dirTree = require("directory-tree");

jest.mock("directory-tree");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/state/source-tree", () => {
  const app = require("express")();
  app.set("config", {
    srcFolderIgnores: ["/ignoredFolder"],
    srcFolder: "userFolder",
    extension: "extension"
  });

  test("srcFolder() calls dirTree()", () => {
    dirTree.mockImplementationOnce(() => {});

    getSourceTree(app);

    expect(dirTree).toHaveBeenCalledWith(`${process.cwd()}/userFolder`, {
      extensions: new RegExp(".(extension|json)$"),
      exclude: [new RegExp("/ignoredFolder")]
    });
  });

  test("srcFolder() returns an object with the sourceTree", () => {
    const result = {
      foo: "bar"
    };

    dirTree.mockImplementationOnce(() => result);

    expect(getSourceTree(app)).toEqual(result);
  });
});
