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

describe("lib/menu/elements/variations", () => {
  describe("with variations", () => {
    const variation = {
      name: "variation"
    };
    const component = {
      index: 1,
      id: 2,
      variations: [variation, variation, variation]
    };

    test("calls listItem.render for each variation", () => {
      const variations = requireComponent("variations");
      const listItem = requireComponent("list-item", true);

      variations.render(component, { path: "foo", variation: "bar" });

      expect(listItem.render).toHaveBeenCalledTimes(3);
    });

    test("calls listItem.render with the correct params", () => {
      const variations = requireComponent("variations");
      const listItem = requireComponent("list-item", true);
      const variationLink = requireComponent("variation-link", true);

      variations.render(component, { path: "foo", variation: "bar" });

      expect(listItem.render).toHaveBeenCalledWith(
        component,
        variationLink.render(),
        "variation"
      );
    });

    test("adds the listItem html to the return value", () => {
      const variations = requireComponent("variations");
      requireComponent("list-item", true);

      expect(
        (
          variations
            .render(component, { path: "foo", variation: "bar" })
            .match(/list-itemHtml/g) || []
        ).length
      ).toBe(3);
    });

    describe("the requested path is the current variation", () => {
      test("calls variationLink.render with the correct params", () => {
        const variations = requireComponent("variations");
        const variationLink = requireComponent("variation-link", true);
        const helpers = require(helpersSrc);
        helpers.pathEqualsRequest = jest.fn(() => true);

        variations.render(component, {});

        expect(variationLink.render).toHaveBeenCalledWith(
          component,
          variation,
          true
        );
      });
    });

    describe("the requested path is not the current variation", () => {
      test("calls variationLink.render with the correct params", () => {
        const variations = requireComponent("variations");
        const variationLink = requireComponent("variation-link", true);
        const helpers = require(helpersSrc);

        helpers.pathEqualsRequest = jest.fn(() => false);

        variations.render(component, {});

        expect(variationLink.render).toHaveBeenCalledWith(
          component,
          variation,
          false
        );
      });
    });
  });

  describe("without variations", () => {
    const component = {
      index: 1,
      id: 2,
      variations: []
    };

    test("doesn't add the listItem html to the return value", () => {
      const variations = requireComponent("variations");

      requireComponent("list", true);

      expect(variations.render(component, {}).indexOf("list-itemHtml")).toBe(
        -1
      );
    });
  });
});