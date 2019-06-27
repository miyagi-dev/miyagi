function requireComponent(componentName, mock) {
  let component = require(`../../../../../src/hbs/getMenuHtml/elements/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

describe("src/hbs/getMenuHtml/elements/index", () => {
  const app = require("express")();
  const structure = "structure";
  const request = "request";
  const id = "id";
  const index = "index";
  const childObject = {};

  app.set("config", {
    extension: "hbs"
  });

  describe("with children", () => {
    test("calls child.render for each child", () => {
      const indexModule = requireComponent("index");
      const child = requireComponent("child", true);

      const navStructure = require("../../../../../src/hbs/getMenuHtml/navStructure.js");
      navStructure.getStructure = jest.fn(() => [
        childObject,
        childObject,
        childObject
      ]);

      indexModule.render(app, structure, request, id, index);

      expect(child.render).toHaveBeenCalledTimes(3);
    });

    test("calls child.render with the correct params", () => {
      const indexModule = requireComponent("index");
      const child = requireComponent("child", true);

      const navStructure = require("../../../../../src/hbs/getMenuHtml/navStructure.js");
      navStructure.getStructure = jest.fn(() => [
        childObject,
        childObject,
        childObject
      ]);

      indexModule.render(app, structure, request, id, index);

      expect(child.render).toHaveBeenCalledWith(childObject, request, app);
    });

    test("adds the child html to the return value", () => {
      const indexModule = requireComponent("index");
      requireComponent("child", true);

      const navStructure = require("../../../../../src/hbs/getMenuHtml/navStructure.js");
      navStructure.getStructure = jest.fn(() => [
        childObject,
        childObject,
        childObject
      ]);

      expect(
        (
          indexModule
            .render(app, structure, request, id, index)
            .match(/childHtml/g) || []
        ).length
      ).toBe(3);
    });
  });

  describe("without children", () => {
    test("returns an empty string", () => {
      const indexModule = requireComponent("index");

      const navStructure = require("../../../../../src/hbs/getMenuHtml/navStructure.js");
      navStructure.getStructure = jest.fn(() => []);

      expect(indexModule.render(app, structure, request, id, index)).toEqual(
        ""
      );
    });
  });
});
