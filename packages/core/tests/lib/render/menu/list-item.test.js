const listItem = require("../../../../lib/render/menu/list-item.js");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/list-item", () => {
  test("renders the correct listItem html", () => {
    expect(listItem.render(1, "content", "variation")).toEqual(
      `<li class="Miyagi-listItem Miyagi-listItem--variation Miyagi-listItem--lvl1">content</li>`
    );
  });
});
