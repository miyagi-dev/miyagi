const list = require("../../../../lib/render/menu/list.js");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/list", () => {
  test("renders the correct list html", () => {
    expect(list.render("variations", 1, "content")).toEqual(
      `<ul class="Roundup-list Roundup-list--lvl1 Roundup-list--variations">content</ul>`
    );
  });
});
