const helpers = require("../../../../../src/hbs/getMenuHtml/helpers.js");

const folderIndex = 1;
const folderId = 2;
const folderShortPath = "foo/bar";
const folderName = "bar";
const folder = {
  shortPath: folderShortPath,
  name: folderName,
  index: folderIndex,
  id: folderId
};

function requireComponent(componentName, mock) {
  let component = require(`../../../../../src/hbs/getMenuHtml/elements/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

describe("src/hbs/getMenuHtml/elements/componentFolder", () => {
  describe("with current folder === requested folder", () => {
    const queryPath = "foo/bar";
    const query = {
      path: queryPath
    };

    describe("without requested variation", () => {
      test("calls link.render with the correct params", () => {
        const link = requireComponent("link", true);
        const componentFolder = requireComponent("componentFolder");
        componentFolder.render(folder, query);
        expect(link.render).toHaveBeenCalledWith(
          folderShortPath,
          folderName,
          helpers.activeState,
          folderIndex
        );
      });
    });

    describe("with requested variation", () => {
      test("calls link.render with the correct params", () => {
        const link = requireComponent("link", true);
        const componentFolder = requireComponent("componentFolder");
        componentFolder.render(
          folder,
          Object.assign(query, { variation: "variation" })
        );
        expect(link.render).toHaveBeenCalledWith(
          folderShortPath,
          folderName,
          "",
          folderIndex
        );
      });
    });
  });

  describe("with current folder !== requested folder", () => {
    const queryPath = "foo/baz";
    const query = {
      path: queryPath
    };

    test("calls link.render with the correct params", () => {
      const link = requireComponent("link", true);
      const componentFolder = requireComponent("componentFolder");
      componentFolder.render(folder, query);
      expect(link.render).toHaveBeenCalledWith(
        folderShortPath,
        folderName,
        "",
        1
      );
    });
  });

  test("adds the link html to the return value", () => {
    const componentFolder = requireComponent("componentFolder");
    requireComponent("link", true);
    expect(
      componentFolder.render({}, {}).indexOf("linkHtml")
    ).toBeGreaterThanOrEqual(0);
  });

  describe("with componentHasVariations being truthy", () => {
    test("adds the toggle html to the return value", () => {
      const componentFolder = requireComponent("componentFolder");
      requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => true);
      helpers.childrenOfFolderContainDirectory = jest.fn(() => false);

      expect(
        componentFolder.render({}, {}).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("request folder is parent of current folder", () => {
      test("calls toggle.render with the correct params", () => {
        const componentFolder = requireComponent("componentFolder");
        const toggle = requireComponent("toggle", true);
        helpers.componentHasVariations = jest.fn(() => true);
        helpers.childrenOfFolderContainDirectory = jest.fn(() => false);
        helpers.pathIsChildOfSecondPath = jest.fn(() => true);
        componentFolder.render(folder, {});
        expect(toggle.render).toHaveBeenCalledWith(folderId, true, folderIndex);
      });
    });

    describe("request folder is not parent of current folder", () => {
      test("calls toggle.render with the correct params", () => {
        const componentFolder = requireComponent("componentFolder");
        const toggle = requireComponent("toggle", true);
        helpers.componentHasVariations = jest.fn(() => true);
        helpers.childrenOfFolderContainDirectory = jest.fn(() => false);
        helpers.pathIsChildOfSecondPath = jest.fn(() => false);
        componentFolder.render(folder, {});
        expect(toggle.render).toHaveBeenCalledWith(
          folderId,
          false,
          folderIndex
        );
      });
    });
  });

  describe("with childrenOfFolderContainDirectory being truthy", () => {
    test("adds the toggle html to the return value", () => {
      const componentFolder = requireComponent("componentFolder");
      requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => false);
      helpers.childrenOfFolderContainDirectory = jest.fn(() => true);
      expect(
        componentFolder.render({}, {}).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("equest folder is parent of current folder", () => {
      const query = {
        path: folderShortPath
      };

      test("calls toggle.render with the correct params", () => {
        const componentFolder = requireComponent("componentFolder");
        const toggle = requireComponent("toggle", true);
        helpers.componentHasVariations = jest.fn(() => false);
        helpers.childrenOfFolderContainDirectory = jest.fn(() => true);
        helpers.pathIsChildOfSecondPath = jest.fn(() => true);
        componentFolder.render(folder, query);
        expect(toggle.render).toHaveBeenCalledWith(folderId, true, folderIndex);
      });
    });

    describe("equest folder is not parent of current folder", () => {
      const query = {
        path: "foo/baz"
      };

      test("calls toggle.render with the correct params", () => {
        const componentFolder = requireComponent("componentFolder");
        const toggle = requireComponent("toggle", true);
        helpers.componentHasVariations = jest.fn(() => false);
        helpers.childrenOfFolderContainDirectory = jest.fn(() => true);
        helpers.pathIsChildOfSecondPath = jest.fn(() => false);
        componentFolder.render(folder, query);
        expect(toggle.render).toHaveBeenCalledWith(
          folderId,
          false,
          folderIndex
        );
      });
    });
  });

  describe("with componentHasVariations and childrenOfFolderContainDirectory being falsy", () => {
    test("doesn't call toggle.render", () => {
      const componentFolder = requireComponent("componentFolder");
      const toggle = requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => false);
      helpers.childrenOfFolderContainDirectory = jest.fn(() => false);
      componentFolder.render({}, {});
      expect(toggle.render).not.toHaveBeenCalled();
    });

    test("doesn't add the toggle html to the return value", () => {
      const componentFolder = requireComponent("componentFolder");
      requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => false);
      helpers.childrenOfFolderContainDirectory = jest.fn(() => false);
      expect(componentFolder.render({}, {}).indexOf("toggleHtml")).toBe(-1);
    });
  });
});
