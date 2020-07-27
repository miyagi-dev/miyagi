const helpersSrc = "../../../../lib/render/menu/helpers.js";
const directoryIndex = 1;
const directoryId = 2;
const directoryShortPath = "foo/bar";
const directoryName = "bar";
const directory = {
  shortPath: directoryShortPath,
  name: directoryName,
  index: directoryIndex,
  id: directoryId,
};

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

const app = {
  get() {
    return {
      isBuild: false,
    };
  },
};

describe("lib/menu/elements/component", () => {
  describe("with current directory === requested directory", () => {
    const requestPath = "foo/bar";
    const request = {
      path: requestPath,
    };

    describe("without requested variation", () => {
      test("renders the link with active state", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        helpers.activeState = "activeState";

        expect(
          component.render(app, directory, request).indexOf("activeState")
        ).toBeGreaterThanOrEqual(0);
      });
    });

    describe("with requested variation", () => {
      test("renders the link without active state", () => {
        const component = requireComponent("component");

        expect(
          component
            .render(
              app,
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
      path: "foo/baz",
    };

    test("renders the link without active state", () => {
      const component = requireComponent("component");

      expect(
        component.render(app, directory, request).indexOf("activeState")
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
        component.render(app, {}, {}).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("requested component is the current component", () => {
      test("calls toggle.render with the correct params", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        const toggle = requireComponent("toggle", true);
        requireComponent("variations", true);
        helpers.componentHasVariations = jest.fn(() => true);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);
        helpers.pathIsParentOfOrEqualRequestedPath = jest.fn(() => true);

        component.render(app, directory, { path: directory.shortPath });

        expect(toggle.render).toHaveBeenCalledWith(
          `${directoryId}-variations`,
          true,
          directoryIndex
        );
      });
    });

    describe("requested component is not the current component", () => {
      test("calls toggle.render with the correct params", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        const toggle = requireComponent("toggle", true);
        requireComponent("variations", true);
        helpers.componentHasVariations = jest.fn(() => true);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);
        helpers.pathIsParentOfOrEqualRequestedPath = jest.fn(() => false);

        component.render(app, directory, {
          path: directory.shortPath + "different-directory",
        });

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
        component.render(app, {}, {}).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("request directory is parent of current directory", () => {
      const request = {
        path: directoryShortPath,
      };

      test("calls toggle.render with the correct params", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        const toggle = requireComponent("toggle", true);
        helpers.componentHasVariations = jest.fn(() => false);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
        helpers.pathIsParentOfOrEqualRequestedPath = jest.fn(() => true);

        component.render(app, directory, request);

        expect(toggle.render).toHaveBeenCalledWith(
          `${directoryId}-variations`,
          true,
          directoryIndex
        );
      });
    });

    describe("request directory is not parent of current directory", () => {
      const request = {
        path: "foo/baz",
      };

      test("calls toggle.render with the correct params", () => {
        const helpers = require(helpersSrc);
        const component = requireComponent("component");
        const toggle = requireComponent("toggle", true);
        helpers.componentHasVariations = jest.fn(() => false);
        helpers.childrenOfDirectoryContainDirectory = jest.fn(() => true);
        helpers.pathIsParentOfOrEqualRequestedPath = jest.fn(() => false);

        component.render(app, directory, request);

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

      component.render(app, {}, {});

      expect(toggle.render).not.toHaveBeenCalled();
    });

    test("doesn't add the toggle html to the return value", () => {
      const helpers = require(helpersSrc);
      const component = requireComponent("component");
      requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => false);
      helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);

      expect(component.render(app, {}, {}).indexOf("toggleHtml")).toBe(-1);
    });
  });
});
