const helpersSrc = "../../../../../src/state/menu/helpers.js";

function requireComponent(componentName, mock) {
  let component = require(`../../../../../src/state/menu/elements/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

beforeEach(() => {
  jest.resetModules();
});

describe("src/menu/elements/directory", () => {
  const path = "foo/bar";
  const id = 1;
  const index = 2;
  const name = "name";
  const directoryObject = {
    path,
    id,
    index,
    name
  };
  const request = {
    path: "foo/bar",
    variation: "baz"
  };

  test("adds the component name with correct index to the html", () => {
    const directory = requireComponent("directory");

    expect(
      directory
        .render(directoryObject, request)
        .indexOf(
          '<span class="Roundup-component Roundup-component--lvl2">name</span>'
        )
    ).toBeGreaterThanOrEqual(0);
  });

  describe("has directory as child and is not in the first level", () => {
    describe("when expanded", () => {
      test("calls toggle.render with the correct params", () => {
        const directory = requireComponent("directory");
        const toggle = requireComponent("toggle", true);
        const helpers = require(helpersSrc);

        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
        helpers.directoryIsNotTopLevel = jest.fn(() => true);
        helpers.pathIsChildOfSecondPath = jest.fn(() => true);

        directory.render(directoryObject, request);

        expect(toggle.render).toHaveBeenCalledWith(
          directoryObject.id,
          true,
          directoryObject.index
        );
      });
    });

    describe("when not expanded", () => {
      test("calls toggle.render with the correct params", () => {
        const directory = requireComponent("directory");
        const toggle = requireComponent("toggle", true);
        const helpers = require(helpersSrc);

        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
        helpers.directoryIsNotTopLevel = jest.fn(() => true);
        helpers.pathIsChildOfSecondPath = jest.fn(() => false);

        directory.render(directoryObject, request);

        expect(toggle.render).toHaveBeenCalledWith(
          directoryObject.id,
          false,
          directoryObject.index
        );
      });
    });

    test("adds the toggle html to the return value", () => {
      const directory = requireComponent("directory");
      requireComponent("toggle", true);

      const helpers = require(helpersSrc);
      helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
      helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
      helpers.directoryIsNotTopLevel = jest.fn(() => true);

      expect(
        directory.render(directoryObject, request).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });
});
