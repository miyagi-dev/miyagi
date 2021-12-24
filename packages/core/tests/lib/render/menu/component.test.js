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
 */
async function requireComponent(componentName) {
  return await import(`../../../../lib/render/menu/${componentName}.js`);
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
      test("renders the link with active state", async () => {
        jest.mock(helpersSrc, () => {
          return {
            activeState: "activeState",
            componentHasVariations: jest.fn(() => true),
            pathIsParentOfOrEqualRequestedPath: jest.fn(() => true),
          };
        });
        jest.mock("../../../../lib/render/menu/variations.js");
        const component = await requireComponent("component");

        expect(
          component.render(app, directory, request).indexOf("activeState")
        ).toBeGreaterThanOrEqual(0);
      });
    });

    describe("with requested variation", () => {
      test("renders the link without active state", async () => {
        const component = await requireComponent("component");

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

    test("renders the link without active state", async () => {
      const component = await requireComponent("component");

      expect(
        component.render(app, directory, request).indexOf("activeState")
      ).toBeGreaterThanOrEqual(-1);
    });
  });

  describe("with componentHasVariations being truthy", () => {
    test("adds the toggle html to the return value", async () => {
      jest.mock(helpersSrc, () => {
        return {
          componentHasVariations: jest.fn(() => true),
          pathIsParentOfOrEqualRequestedPath: jest.fn(() => true),
          childrenOfDirectoryContainDirectory: jest.fn(() => false),
        };
      });
      jest.mock("../../../../lib/render/menu/variations.js");
      jest.mock("../../../../lib/render/menu/toggle.js", () => {
        return {
          render: jest.fn(() => "toggleHtml"),
        };
      });

      const component = await requireComponent("component");

      expect(
        component.render(app, {}, {}).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("requested component is the current component", () => {
      test("calls toggle.render with the correct params", async () => {
        jest.mock(helpersSrc, () => {
          return {
            componentHasVariations: jest.fn(() => true),
            pathIsParentOfOrEqualRequestedPath: jest.fn(() => true),
            childrenOfDirectoryContainDirectory: jest.fn(() => false),
          };
        });
        jest.mock("../../../../lib/render/menu/variations.js");
        jest.mock("../../../../lib/render/menu/toggle.js", () => {
          return {
            render: jest.fn(),
          };
        });

        const component = await requireComponent("component");
        const renderToggle = await requireComponent("toggle");

        component.render(app, directory, { path: directory.shortPath });

        expect(renderToggle.render).toHaveBeenCalledWith(
          `${directoryId}-variations`,
          true,
          directoryIndex
        );
      });
    });

    describe("requested component is not the current component", () => {
      test("calls toggle.render with the correct params", async () => {
        jest.mock(helpersSrc, () => {
          return {
            componentHasVariations: jest.fn(() => true),
            childrenOfDirectoryContainDirectory: jest.fn(() => false),
            pathIsParentOfOrEqualRequestedPath: jest.fn(() => false),
          };
        });
        jest.mock("../../../../lib/render/menu/toggle.js", () => {
          return {
            render: jest.fn(),
          };
        });
        jest.mock("../../../../lib/render/menu/variations.js");

        const component = await requireComponent("component");
        const renderToggle = await requireComponent("toggle");

        component.render(app, directory, {
          path: directory.shortPath + "different-directory",
        });

        expect(renderToggle.render).toHaveBeenCalledWith(
          `${directoryId}-variations`,
          false,
          directoryIndex
        );
      });
    });
  });

  describe("with childrenOfDirectoryContainDirectory being truthy", () => {
    test("adds the toggle html to the return value", async () => {
      jest.mock(helpersSrc, () => {
        return {
          componentHasVariations: jest.fn(() => false),
          childrenOfDirectoryContainDirectory: jest.fn(() => true),
          pathIsParentOfOrEqualRequestedPath: jest.fn(() => true),
        };
      });
      jest.mock("../../../../lib/render/menu/toggle.js", () => {
        return {
          render: jest.fn(() => "toggleHtml"),
        };
      });
      jest.mock("../../../../lib/render/menu/variations.js");

      const component = await requireComponent("component");

      expect(
        component.render(app, {}, {}).indexOf("toggleHtml")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("request directory is parent of current directory", () => {
      const request = {
        path: directoryShortPath,
      };

      test("calls toggle.render with the correct params", async () => {
        jest.mock(helpersSrc, () => {
          return {
            componentHasVariations: jest.fn(() => false),
            childrenOfDirectoryContainDirectory: jest.fn(() => true),
            pathIsParentOfOrEqualRequestedPath: jest.fn(() => true),
          };
        });
        jest.mock("../../../../lib/render/menu/toggle.js", () => {
          return {
            render: jest.fn(),
          };
        });
        const component = await requireComponent("component");
        const renderToggle = await requireComponent("toggle");

        component.render(app, directory, request);

        expect(renderToggle.render).toHaveBeenCalledWith(
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

      test("calls toggle.render with the correct params", async () => {
        jest.mock(helpersSrc, () => {
          return {
            componentHasVariations: jest.fn(() => false),
            childrenOfDirectoryContainDirectory: jest.fn(() => true),
            pathIsParentOfOrEqualRequestedPath: jest.fn(() => false),
          };
        });
        jest.mock("../../../../lib/render/menu/toggle.js", () => {
          return {
            render: jest.fn(),
          };
        });
        const component = await requireComponent("component");
        const renderToggle = await requireComponent("toggle");

        component.render(app, directory, request);

        expect(renderToggle.render).toHaveBeenCalledWith(
          `${directoryId}-variations`,
          false,
          directoryIndex
        );
      });
    });
  });

  describe("with componentHasVariations and childrenOfDirectoryContainDirectory being falsy", () => {
    test("doesn't call toggle.render", async () => {
      const helpers = require(helpersSrc);
      const component = await requireComponent("component");
      const renderToggle = await requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => false);
      helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);

      component.render(app, {}, {});

      expect(renderToggle.render).not.toHaveBeenCalled();
    });

    test("doesn't add the toggle html to the return value", async () => {
      const helpers = require(helpersSrc);
      const component = await requireComponent("component");
      await requireComponent("toggle", true);
      helpers.componentHasVariations = jest.fn(() => false);
      helpers.childrenOfDirectoryContainDirectory = jest.fn(() => false);

      expect(component.render(app, {}, {}).indexOf("toggleHtml")).toBe(-1);
    });
  });
});
