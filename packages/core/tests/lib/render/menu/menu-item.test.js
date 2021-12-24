const helpersSrc = "../../../../lib/render/menu/helpers.js";

/**
 * @param componentName
 */
async function requireComponent(componentName) {
  return await import(`../../../../lib/render/menu/${componentName}.js`);
}

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("lib/menu/elements/menu-item", () => {
  const app = {
    get: () => ({
      isBuild: false,
    }),
  };
  const id = "id";

  test("calls listItem.render with the correct params", async () => {
    jest.doMock(helpersSrc, () => {
      return {
        __esModule: true,
        default: {
          childrenOfDirectoryContainDirectory: jest.fn(() => true),
          directoryHasComponent: jest.fn(() => true),
          componentHasVariations: jest.fn(() => true),
        },
      };
    });
    jest.doMock("../../../../lib/render/menu/component.js", () => {
      return {
        __esModule: true,
        render: jest.fn(),
      };
    });
    jest.doMock("../../../../lib/render/menu/list-item.js", () => {
      return {
        __esModule: true,
        render: jest.fn(),
      };
    });

    const renderMenuItem = await requireComponent("menu-item");
    const renderListItem = await requireComponent("list-item");
    const dirObject = {};

    renderMenuItem.render(dirObject);

    expect(renderListItem.render).toHaveBeenCalled();
  });

  describe("with children", () => {
    const type = "type";
    const index = "index";
    const children = [{ index }, {}, {}];
    const request = "request";
    const directoryObject = {
      children,
      id,
      type,
    };

    test("calls renderMenu with the correct params", async () => {
      jest.doMock(helpersSrc, () => {
        return {
          __esModule: true,
          default: {
            childrenOfDirectoryContainDirectory: jest.fn(() => true),
            directoryHasComponent: jest.fn(() => true),
            componentHasVariations: jest.fn(() => true),
            pathIsParentOfOrEqualRequestedPath: jest.fn(() => true),
          },
        };
      });
      jest.doMock("../../../../lib/render/menu/index.js", () => {
        return {
          __esModule: true,
          render: jest.fn(),
        };
      });
      jest.doMock("../../../../lib/render/menu/variations.js", () => {
        return { __esModule: true, render: jest.fn() };
      });
      jest.dontMock("../../../../lib/render/menu/component.js");

      const renderMenuItem = await requireComponent("menu-item");
      const { render } = await requireComponent("index");

      renderMenuItem.render(directoryObject, request, app);

      expect(render).toHaveBeenCalledWith(app, children, request, index);
    });

    test("adds the menu html to the return value", async () => {
      jest.doMock(helpersSrc, () => {
        return {
          __esModule: true,
          default: {
            childrenOfDirectoryContainDirectory: jest.fn(() => true),
            directoryHasComponent: jest.fn(() => true),
            componentHasVariations: jest.fn(() => true),
            pathIsParentOfOrEqualRequestedPath: jest.fn(() => true),
          },
        };
      });
      jest.doMock("../../../../lib/render/menu/index.js", () => {
        return {
          __esModule: true,
          render: jest.fn(() => "indexHtml"),
        };
      });
      jest.dontMock("../../../../lib/render/menu/list-item.js");

      const renderMenuItem = await requireComponent("menu-item");

      expect(
        renderMenuItem
          .render(directoryObject, request, app)
          .indexOf("indexHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });

  describe("item is a component", () => {
    const request = "request";
    const directoryObject = {};

    test("calls component.render with the correct params", async () => {
      jest.doMock(helpersSrc, () => {
        return {
          __esModule: true,
          default: {
            directoryHasComponent: jest.fn(() => true),
          },
        };
      });
      jest.doMock("../../../../lib/render/menu/component.js", () => {
        return { __esModule: true, render: jest.fn() };
      });
      const renderMenuItem = await requireComponent("menu-item");
      const renderComponent = await requireComponent("component");

      renderMenuItem.render(directoryObject, request, app);

      expect(renderComponent.render).toHaveBeenCalledWith(
        app,
        directoryObject,
        request
      );
    });

    test("adds the menuItem html to the return value", async () => {
      jest.doMock(helpersSrc, () => {
        return {
          __esModule: true,
          default: {
            directoryHasComponent: jest.fn(() => true),
          },
        };
      });
      jest.doMock("../../../../lib/render/menu/component.js", () => {
        return {
          __esModule: true,
          render: jest.fn(() => "componentHtml"),
        };
      });
      const renderMenuItem = await requireComponent("menu-item");

      expect(
        renderMenuItem
          .render(directoryObject, request, app)
          .indexOf("componentHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });

  describe("item isn't a component", () => {
    jest.doMock(helpersSrc, () => {
      return {
        __esModule: true,
        directoryHasComponent: jest.fn(() => false),
      };
    });

    const request = "request";
    const directoryObject = {};

    test("calls directory.render with the correct params", async () => {
      jest.doMock(helpersSrc, () => {
        return {
          __esModule: true,
          default: {
            directoryHasComponent: jest.fn(() => false),
          },
        };
      });
      jest.doMock("../../../../lib/render/menu/directory.js", () => {
        return {
          __esModule: true,
          render: jest.fn(),
        };
      });

      const renderMenuItem = await requireComponent("menu-item");
      const renderDirectory = await requireComponent("directory");

      renderMenuItem.render(directoryObject, request, app);

      expect(renderDirectory.render).toHaveBeenCalledWith(
        app,
        directoryObject,
        request
      );
    });

    test("adds the menuItem html to the return value", async () => {
      jest.doMock(helpersSrc, () => {
        return {
          __esModule: true,
          default: {
            directoryHasComponent: jest.fn(() => false),
          },
        };
      });
      jest.doMock("../../../../lib/render/menu/directory.js", () => {
        return {
          __esModule: true,
          render: jest.fn(() => "directoryHtml"),
        };
      });
      jest.doMock("../../../../lib/render/menu/variations.js", () => {
        return {
          __esModule: true,
        };
      });
      jest.dontMock("../../../../lib/render/menu/list-item.js");

      const renderMenuItem = await requireComponent("menu-item");

      expect(
        renderMenuItem
          .render(directoryObject, request, app)
          .indexOf("directoryHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });
});
