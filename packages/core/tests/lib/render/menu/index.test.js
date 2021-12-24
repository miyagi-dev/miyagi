import deepMerge from "deepmerge";
import config from "../../../../lib/miyagi-config.js";

/**
 * @param componentName
 * @param mock
 */
async function requireComponent(componentName, mock) {
  let component = await import(
    `../../../../lib/render/menu/${componentName}.js`
  );

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
    test("calls menuItem.render for each menuItem", async () => {
      const menu = await requireComponent("index");
      const renderMenuItem = await requireComponent("menu-item", true);

      menu.render(
        app,
        [menuItemObject, menuItemObject, menuItemObject],
        request,
        id,
        index
      );

      expect(renderMenuItem.render).toHaveBeenCalledTimes(3);
    });

    test("calls menuItem.render with the correct params", async () => {
      const menu = await requireComponent("index");
      const renderMenuItem = await requireComponent("menu-item", true);

      menu.render(
        app,
        [menuItemObject, menuItemObject, menuItemObject],
        request,
        id,
        index
      );

      expect(renderMenuItem.render).toHaveBeenCalledWith(
        menuItemObject,
        request,
        app
      );
    });

    test("adds the menuItem html to the return value", async () => {
      const menu = await requireComponent("index");
      await requireComponent("menu-item", true);

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
    test("returns an empty string", async () => {
      const menu = await requireComponent("index");

      expect(menu.render(app, [], request, id, index)).toEqual("");
    });
  });
});
