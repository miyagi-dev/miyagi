const listItem = require("../../../../../src/state/menu/elements/listItem.js");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("src/menu/elements/listItem", () => {
  test("renders the correct listItem html", () => {
    expect(listItem.render({ index: 1 }, "content", "variation")).toEqual(
      `<li class="Roundup-listItem Roundup-listItem--variation Roundup-listItem--lvl1">content</li>`
    );
  });
});
