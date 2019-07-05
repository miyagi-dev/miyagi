function requireComponent(componentName, mock) {
  let component = require(`../../../../../src/state/menu/elements/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("src/menu/elements/menu", () => {
  const app = require("express")();
  const request = "request";
  const id = "id";
  const index = "index";
  const menuItemObject = {};

  app.set("config", {
    extension: "hbs"
  });

  describe("with children", () => {
    test("calls menuItem.render for each menuItem", () => {
      const menu = requireComponent("menu");
      const menuItem = requireComponent("menuItem", true);

      menu.render(
        app,
        [menuItemObject, menuItemObject, menuItemObject],
        request,
        id,
        index
      );

      expect(menuItem.render).toHaveBeenCalledTimes(3);
    });

    test("calls menuItem.render with the correct params", () => {
      const menu = requireComponent("menu");
      const menuItem = requireComponent("menuItem", true);

      menu.render(
        app,
        [menuItemObject, menuItemObject, menuItemObject],
        request,
        id,
        index
      );

      expect(menuItem.render).toHaveBeenCalledWith(
        menuItemObject,
        request,
        app
      );
    });

    test("adds the menuItem html to the return value", () => {
      const menu = requireComponent("menu");
      requireComponent("menuItem", true);

      expect(
        (
          menu
            .render(
              app,
              [menuItemObject, menuItemObject, menuItemObject],
              request,
              id,
              index
            )
            .match(/menuItemHtml/g) || []
        ).length
      ).toBe(3);
    });
  });

  describe("without children", () => {
    test("returns an empty string", () => {
      const menu = requireComponent("menu");
      expect(menu.render(app, [], request, id, index)).toEqual("");
    });
  });
});
