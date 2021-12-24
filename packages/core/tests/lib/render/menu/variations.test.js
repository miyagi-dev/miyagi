const helpersSrc = "../../../../lib/render/menu/helpers.js";

/**
 * @param componentName

 */
async function requireComponent(componentName) {
  return await import(`../../../../lib/render/menu/${componentName}.js`);
}

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/variations", () => {
  describe("with variations", () => {
    const variation = {
      name: "variation",
    };
    const component = {
      index: 1,
      id: 2,
      variations: [variation, variation, variation],
    };

    test("calls listItem.render for each variation", async () => {
      jest.mock("../../../../lib/render/menu/list-item.js", () => {
        return {
          render: jest.fn(),
        };
      });
      const variations = await requireComponent("variations");
      const renderListItem = await requireComponent("list-item");

      variations.render(false, component, {
        path: "foo",
        variation: "bar",
      });

      expect(renderListItem.render).toHaveBeenCalledTimes(3);
    });

    test("calls listItem.render with the correct params", async () => {
      jest.mock("../../../../lib/render/menu/list-item.js", () => {
        return {
          render: jest.fn(),
        };
      });
      jest.mock("../../../../lib/render/menu/variation-link.js", () => {
        return {
          render: jest.fn(),
        };
      });

      const variations = await requireComponent("variations");
      const renderListItem = await requireComponent("list-item");
      const renderVariationLink = await requireComponent("variation-link");

      variations.render(false, component, {
        path: "foo",
        variation: "bar",
      });

      expect(renderListItem.render).toHaveBeenCalledWith(
        component.index,
        renderVariationLink.render(),
        "variation"
      );
    });

    test("adds the listItem html to the return value", async () => {
      jest.mock("../../../../lib/render/menu/list-item.js", () => {
        return {
          render: jest.fn(() => "list-itemHtml"),
        };
      });

      const variations = await requireComponent("variations");

      expect(
        (
          variations
            .render(false, component, {
              path: "foo",
              variation: "bar",
            })
            .match(/list-itemHtml/g) || []
        ).length
      ).toBe(3);
    });

    describe("the requested path is the current variation", () => {
      test("calls variationLink.render with the correct params", async () => {
        jest.mock(helpersSrc, () => {
          return {
            pathEqualsRequest: jest.fn(() => true),
          };
        });
        jest.mock("../../../../lib/render/menu/variation-link.js", () => {
          return {
            render: jest.fn(),
          };
        });

        const variations = await requireComponent("variations");
        const renderVariationLink = await requireComponent("variation-link");

        variations.render(false, component, {});

        expect(renderVariationLink.render).toHaveBeenCalledWith(
          false,
          component,
          variation,
          true
        );
      });
    });

    describe("the requested path is not the current variation", () => {
      test("calls variationLink.render with the correct params", async () => {
        jest.mock("../../../../lib/render/menu/variation-link.js", () => {
          return {
            render: jest.fn(),
          };
        });

        const variations = await requireComponent("variations");
        const renderVariationLink = await requireComponent("variation-link");
        const helpers = require(helpersSrc);

        helpers.pathEqualsRequest = jest.fn(() => false);

        variations.render(false, component, {});

        expect(renderVariationLink.render).toHaveBeenCalledWith(
          false,
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
      variations: [],
    };

    test("doesn't add the listItem html to the return value", async () => {
      const variations = await requireComponent("variations");

      await requireComponent("list", true);

      expect(
        variations.render(false, component, {}).indexOf("list-itemHtml")
      ).toBe(-1);
    });
  });
});
