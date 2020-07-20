const deepMerge = require("deepmerge");
const config = require("../../../../lib/config.json");

const helpersSrc = "../../../../lib/render/menu/helpers.js";

/**
 * @param componentName
 * @param mock
 */
function requireComponent(componentName, mock) {
  const component = require(`../../../../lib/render/menu/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/directory", () => {
  const fullPath = "foo/bar";
  const id = 1;
  const index = 2;
  const name = "name";
  const directoryObject = {
    fullPath,
    id,
    index,
    name,
  };
  const request = {
    path: "foo/bar",
    variation: "baz",
  };
  const app = require("express")();
  app.set(
    "config",
    deepMerge(config.defaultUserConfig, {
      components: {
        folder: "srcFolder",
      },
    })
  );

  test("adds the component name with correct index to the html", () => {
    const directory = requireComponent("directory");

    expect(
      directory
        .render(app, directoryObject, request)
        .indexOf(
          '<span class="Miyagi-component Miyagi-component--lvl2">name</span>'
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
        helpers.pathIsChildOfOrEqualSecondPath = jest.fn(() => true);

        directory.render(app, directoryObject, request);

        expect(toggle.render).toHaveBeenCalledWith(
          `${directoryObject.id}-components`,
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
        helpers.pathIsChildOfOrEqualSecondPath = jest.fn(() => false);

        directory.render(app, directoryObject, request);

        expect(toggle.render).toHaveBeenCalledWith(
          `${directoryObject.id}-components`,
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
        directory.render(app, directoryObject, request).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });
});
