const helpersSrc = "../../../../../lib/state/menu/elements/_helpers.js";

function requireComponent(componentName, mock) {
  let component = require(`../../../../../lib/state/menu/elements/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/menu-item", () => {
  const app = "app";
  const id = "id";

  test("calls listItem.render with the correct params", () => {
    const menuItem = requireComponent("menu-item");
    const listItem = requireComponent("list-item", true);
    const dirObject = {};

    menuItem.render(dirObject);

    expect(listItem.render).toHaveBeenCalled();
  });

  describe("with children", () => {
    const type = "type";
    const index = "index";
    const children = [{ index }, {}, {}];
    const request = "request";
    const directoryObject = {
      children,
      id,
      type
    };

    test("calls menu.render with the correct params", () => {
      const menuItem = requireComponent("menu-item");
      const menu = requireComponent("menu", true);

      menuItem.render(directoryObject, request, app);

      expect(menu.render).toHaveBeenCalledWith(
        app,
        children,
        request,
        id,
        index
      );
    });

    test("adds the menu html to the return value", () => {
      const menuItem = requireComponent("menu-item");

      requireComponent("menu", true);

      expect(
        menuItem.render(directoryObject, request, app).indexOf("menuHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });

  describe("item is a component", () => {
    const request = "request";
    const directoryObject = {};

    test("calls component.render with the correct params", () => {
      const helpers = require(helpersSrc);
      const menuItem = requireComponent("menu-item");
      const component = requireComponent("component", true);
      helpers.directoryHasComponent = jest.fn(() => true);

      menuItem.render(directoryObject, request, app);

      expect(component.render).toHaveBeenCalledWith(directoryObject, request);
    });

    test("adds the menuItem html to the return value", () => {
      const helpers = require(helpersSrc);
      const menuItem = requireComponent("menu-item");
      helpers.directoryHasComponent = jest.fn(() => true);

      requireComponent("component", true);

      expect(
        menuItem.render(directoryObject, request, app).indexOf("componentHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });

  describe("item isn't a component", () => {
    const helpers = require(helpersSrc);
    const request = "request";
    const directoryObject = {};

    helpers.directoryHasComponent = jest.fn(() => false);

    test("calls directory.render with the correct params", () => {
      const menuItem = requireComponent("menu-item");
      const directory = requireComponent("directory", true);

      menuItem.render(directoryObject, request, app);

      expect(directory.render).toHaveBeenCalledWith(
        app,
        directoryObject,
        request
      );
    });

    test("adds the menuItem html to the return value", () => {
      const menuItem = requireComponent("menu-item");

      requireComponent("directory", true);

      expect(
        menuItem.render(directoryObject, request, app).indexOf("directoryHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });
});
