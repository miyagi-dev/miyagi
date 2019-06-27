function requireComponent(componentName, mock) {
  let component = require(`../../../../../src/hbs/getMenuHtml/elements/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

describe("src/hbs/getMenuHtml/elements/child", () => {
  const app = "app";
  const id = "id";

  describe("with children", () => {
    const type = "type";
    const index = "index";
    const children = [{ index }, {}, {}];
    const request = "request";
    const childObject = {
      children,
      id,
      type
    };

    test("calls menu.render with the correct params", () => {
      const child = requireComponent("child");
      const menu = requireComponent("index", true);

      child.render(childObject, request, app);

      expect(menu.render).toHaveBeenCalledWith(
        app,
        children,
        request,
        id,
        index
      );
    });

    test("adds the child html to the return value", () => {
      const child = requireComponent("child");

      requireComponent("index", true);

      expect(
        child.render(childObject, request, app).indexOf("indexHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });

  describe("with type === 'directoy'", () => {
    const type = "directory";
    const request = "request";
    const childObject = {
      type
    };

    test("calls folder.render with the correct params", () => {
      const child = requireComponent("child");
      const folder = requireComponent("folder", true);

      child.render(childObject, request, app);

      expect(folder.render).toHaveBeenCalledWith(childObject, request);
    });

    test("adds the child html to the return value", () => {
      const child = requireComponent("child");

      requireComponent("folder", true);

      expect(
        child.render(childObject, request, app).indexOf("folderHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });

  describe("with type !== 'directoy'", () => {
    const type = "!directory";
    const request = "request";
    const childObject = {
      type
    };

    test("calls file.render with the correct params", () => {
      const child = requireComponent("child");
      const file = requireComponent("file", true);

      child.render(childObject, request, app);

      expect(file.render).toHaveBeenCalledWith(childObject, request);
    });

    test("adds the child html to the return value", () => {
      const child = requireComponent("child");

      requireComponent("file", true);

      expect(
        child.render(childObject, request, app).indexOf("fileHtml")
      ).toBeGreaterThanOrEqual(0);
    });
  });
});
