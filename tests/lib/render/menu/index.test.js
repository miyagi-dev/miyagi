const deepMerge = require("deepmerge");
const config = require("../../../../lib/config.json");

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

describe("lib/menu/elements/menu", () => {
  const app = require("express")();
  const request = "request";
  const id = "id";
  const index = "index";
  const menuItemObject = {};

  app.set(
    "config",
    deepMerge(config.defaultUserConfig, {
      files: {
        templates: {
          extension: "hbs",
        },
      },
    })
  );

  describe("with children", () => {
    test("calls menuItem.render for each menuItem", () => {
      const menu = requireComponent("index");
      const menuItem = requireComponent("menu-item", true);

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
      const menu = requireComponent("index");
      const menuItem = requireComponent("menu-item", true);

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
      const menu = requireComponent("index");
      requireComponent("menu-item", true);

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
            .match(/menu-itemHtml/g) || []
        ).length
      ).toBe(3);
    });
  });

  describe("without children", () => {
    test("returns an empty string", () => {
      const menu = requireComponent("index");
      expect(menu.render(app, [], request, id, index)).toEqual("");
    });
  });
});
