const helpers = require("../../../../../src/hbs/getMenuHtml/helpers.js");

function requireComponent(componentName, mock) {
  let component = require(`../../../../../src/hbs/getMenuHtml/elements/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

describe("src/hbs/getMenuHtml/elements/variations", () => {
  test("adds the list html to the return value", () => {
    const variations = requireComponent("variations");

    requireComponent("list", true);

    expect(
      variations.render({ index: 1, id: 2, variations: [] }).indexOf("listHtml")
    ).toBeGreaterThanOrEqual(0);
  });

  test("calls list.render with the correct params", () => {
    const variations = requireComponent("variations");
    const list = requireComponent("list", true);

    variations.render({ index: 1, id: 2, variations: [] });

    expect(list.render).toHaveBeenCalledWith("variations", 1, 2);
  });

  describe("with variations", () => {
    const variation = {
      name: "variation"
    };
    const child = {
      index: 1,
      id: 2,
      variations: [variation, variation, variation]
    };

    test("calls listItem.render for each child variation", () => {
      const variations = requireComponent("variations");
      const listItem = requireComponent("listItem", true);

      variations.render(child, { path: "foo", variation: "bar" });

      expect(listItem.render).toHaveBeenCalledTimes(3);
    });

    test("calls listItem.render with the correct params", () => {
      const variations = requireComponent("variations");
      const listItem = requireComponent("listItem", true);

      variations.render(child, { path: "foo", variation: "bar" });

      expect(listItem.render).toHaveBeenCalledWith(child);
    });

    test("adds the listItem html to the return value", () => {
      const variations = requireComponent("variations");
      requireComponent("listItem", true);

      expect(
        (
          variations
            .render(child, { path: "foo", variation: "bar" })
            .match(/listItemHtml/g) || []
        ).length
      ).toBe(3);
    });

    test("calls variationLink.render for each child variation", () => {
      const variations = requireComponent("variations");
      const variationLink = requireComponent("variationLink", true);

      variations.render(child, { path: "foo", variation: "bar" });

      expect(variationLink.render).toHaveBeenCalledTimes(3);
    });

    test("adds the variationLink html to the return value", () => {
      const variations = requireComponent("variations");
      requireComponent("variationLink", true);

      expect(
        (
          variations
            .render(child, { path: "foo", variation: "bar" })
            .match(/variationLinkHtml/g) || []
        ).length
      ).toBe(3);
    });

    describe("the requested path is the current variation", () => {
      test("calls variationLink.render with the correct params", () => {
        const variations = requireComponent("variations");
        const variationLink = requireComponent("variationLink", true);

        helpers.pathEqualsRequest = jest.fn(() => true);

        variations.render(child, { path: "foo", variation: "bar" });

        expect(variationLink.render).toHaveBeenCalledWith(
          child,
          variation,
          ' aria-current="page"'
        );
      });
    });

    describe("the requested path is not the current variation", () => {
      test("calls variationLink.render with the correct params", () => {
        const variations = requireComponent("variations");
        const variationLink = requireComponent("variationLink", true);

        helpers.pathEqualsRequest = jest.fn(() => false);

        variations.render(child, { path: "foo", variation: "bar" });

        expect(variationLink.render).toHaveBeenCalledWith(child, variation, "");
      });
    });
  });
});
