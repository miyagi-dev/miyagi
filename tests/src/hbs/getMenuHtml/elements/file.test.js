function requireComponent(componentName, mock) {
  let component = require(`../../../../../src/hbs/getMenuHtml/elements/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

describe("src/hbs/getMenuHtml/elements/file", () => {
  const childShortPath = "foo/bar";
  const childName = "bar";
  const childIndex = 1;
  const child = {
    shortPath: childShortPath,
    name: childName,
    index: childIndex
  };

  describe("with the requested path being the current", () => {
    describe("without requested variation", () => {
      test("calls link.render with the correct params", () => {
        const file = requireComponent("file");
        const link = requireComponent("link", true);

        file.render(child, { path: childShortPath });

        expect(link.render).toHaveBeenCalledWith(
          childShortPath,
          childName,
          ' aria-current="page"',
          childIndex
        );
      });
    });

    describe("with requested variation", () => {
      test("calls link.render with the correct params", () => {
        const file = requireComponent("file");
        const link = requireComponent("link", true);

        file.render(child, { path: childShortPath, variation: "variation" });

        expect(link.render).toHaveBeenCalledWith(
          childShortPath,
          childName,
          "",
          childIndex
        );
      });
    });
  });

  describe("with the requested path not being the current", () => {
    test("calls link.render with the correct params", () => {
      const file = requireComponent("file");
      const link = requireComponent("link", true);

      file.render(child, { path: "foo/baz" });

      expect(link.render).toHaveBeenCalledWith(
        childShortPath,
        childName,
        "",
        childIndex
      );
    });
  });

  test("adds the link html to the return value", () => {
    const file = requireComponent("file");
    requireComponent("link", true);

    expect(
      file.render(child, { path: "foo" }).indexOf("linkHtml")
    ).toBeGreaterThanOrEqual(0);
  });
});
