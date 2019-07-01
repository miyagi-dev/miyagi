const listItem = require("../../../../../src/state/menu/elements/listItem.js");

beforeEach(() => {
  jest.resetModules();
});

describe("src/menu/elements/listItem", () => {
  test("renders the correct listItem html", () => {
    expect(listItem.render({ index: 1 }, "content")).toEqual(
      `<li class="Roundup-listItem Roundup-listItem--lvl1">content</li>`
    );
  });
});
