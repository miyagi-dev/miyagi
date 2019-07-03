const sourceTree = require("../../../src/state/sourceTree.js");
const dirTree = require("directory-tree");

jest.mock("directory-tree");

describe("src/state/sourceTree", () => {
  const app = require("express")();
  app.set("config", {
    srcFolderIgnores: ["/ignoredFolder"],
    srcFolder: "userFolder",
    extension: "extension"
  });

  test("srcFolder() calls dirTree()", () => {
    dirTree.mockImplementationOnce(() => {});

    sourceTree(app);

    expect(dirTree).toHaveBeenCalledWith(
      `${process.cwd()}/userFolder`,
      {
        extensions: new RegExp(".(extension|json)$"),
        exclude: [new RegExp("/ignoredFolder")]
      },
      expect.any(Function)
    );
  });

  test("srcFolder() returns an object with the sourceTree", () => {
    const result = {
      foo: "bar"
    };

    dirTree.mockImplementationOnce(() => result);

    expect(sourceTree(app)).toEqual(result);
  });
});
