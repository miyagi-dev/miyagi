const helpersSrc = "../../../../lib/render/menu/_helpers.js";
const directoryIndex = 1;
const directoryId = 2;
const directoryShortPath = "foo/bar";
const directoryName = "bar";
const directory = {
  shortPath: directoryShortPath,
  name: directoryName,
  index: directoryIndex,
  id: directoryId
};

function requireComponent(componentName, mock) {
  let component = require(`../../../../lib/render/menu/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/component", () => {
  describe("with current directory === requested directory", () => {
    const requestPath = "foo/bar";
    const request = {
      path: requestPath
    };

    describe("without requested variation", () => {
      test("renders the link with active state", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        helpers.activeState = "activeState";

        expect(
          component.render(directory, request).indexOf("activeState")
        ).toBeGreaterThanOrEqual(0);
      });
    });

    describe("with requested variation", () => {
      test("renders the link without active state", () => {
        const component = requireComponent("component");

        expect(
          component
            .render(
              directory,
              Object.assign(request, { variation: "variation" })
            )
            .indexOf("activeState")
        ).toBeGreaterThanOrEqual(-1);
      });
    });
  });

  describe("with current directory !== requested directory", () => {
    const request = {
      path: "foo/baz"
    };

    test("renders the link without active state", () => {
      const component = requireComponent("component");

      expect(
        component.render(directory, request).indexOf("activeState")
      ).toBeGreaterThanOrEqual(-1);
    });
  });

  describe("with componentHasVariations being truthy", () => {
    test("adds the toggle html to the return value", () => {
      const helpers = require(helpersSrc);
      const component = requireComponent("component");
      requireComponent("variations", true);
      requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => true);
      helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);

      expect(
        component.render({}, {}).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("request directory is parent of current directory", () => {
      test("calls toggle.render with the correct params", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        const toggle = requireComponent("toggle", true);
        requireComponent("variations", true);
        helpers.componentHasVariations = jest.fn(() => true);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);
        helpers.pathIsChildOfSecondPath = jest.fn(() => true);

        component.render(directory, {});

        expect(toggle.render).toHaveBeenCalledWith(
          `${directoryId}-variations`,
          true,
          directoryIndex
        );
      });
    });

    describe("request directory is not parent of current directory", () => {
      test("calls toggle.render with the correct params", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        const toggle = requireComponent("toggle", true);
        requireComponent("variations", true);
        helpers.componentHasVariations = jest.fn(() => true);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);
        helpers.pathIsChildOfSecondPath = jest.fn(() => false);

        component.render(directory, {});

        expect(toggle.render).toHaveBeenCalledWith(
          `${directoryId}-variations`,
          false,
          directoryIndex
        );
      });
    });
  });

  describe("with childrenOfDirectoryContainDirectory being truthy", () => {
    test("adds the toggle html to the return value", () => {
      const helpers = require(helpersSrc);
      const component = requireComponent("component");
      requireComponent("toggle", true);
      requireComponent("variations", true);
      helpers.componentHasVariations = jest.fn(() => false);
      helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);

      expect(
        component.render({}, {}).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("request directory is parent of current directory", () => {
      const request = {
        path: directoryShortPath
      };

      test("calls toggle.render with the correct params", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        const toggle = requireComponent("toggle", true);
        helpers.componentHasVariations = jest.fn(() => false);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
        helpers.pathIsChildOfSecondPath = jest.fn(() => true);

        component.render(directory, request);

        expect(toggle.render).toHaveBeenCalledWith(
          `${directoryId}-variations`,
          true,
          directoryIndex
        );
      });
    });

    describe("request directory is not parent of current directory", () => {
      const request = {
        path: "foo/baz"
      };

      test("calls toggle.render with the correct params", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        const toggle = requireComponent("toggle", true);
        helpers.componentHasVariations = jest.fn(() => false);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
        helpers.pathIsChildOfSecondPath = jest.fn(() => false);

        component.render(directory, request);

        expect(toggle.render).toHaveBeenCalledWith(
          `${directoryId}-variations`,
          false,
          directoryIndex
        );
      });
    });
  });

  describe("with componentHasVariations and childrenOfDirectoryContainDirectory being falsy", () => {
    test("doesn't call toggle.render", () => {
      const helpers = require(helpersSrc);
      const component = requireComponent("component");
      const toggle = requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => false);
      helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);

      component.render({}, {});

      expect(toggle.render).not.toHaveBeenCalled();
    });

    test("doesn't add the toggle html to the return value", () => {
      const helpers = require(helpersSrc);
      const component = requireComponent("component");
      requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => false);
      helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);

      expect(component.render({}, {}).indexOf("toggleHtml")).toBe(-1);
    });
  });
});
