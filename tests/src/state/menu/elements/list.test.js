const list = require("../../../../../src/state/menu/elements/list.js");

beforeEach(() => {
  jest.resetModules();
});

describe("src/menu/elements/list", () => {
  describe("without id", () => {
    test("renders the correct list html without id", () => {
      expect(list.render("variations", 1, null, "content")).toEqual(
        `<ul class="Roundup-list Roundup-list--lvl1 Roundup-list--variations">content</ul>`
      );
    });
  });

  describe("without id", () => {
    test("renders the correct list html with id", () => {
      expect(list.render("variations", 1, "id-2", "content")).toEqual(
        `<ul class="Roundup-list Roundup-list--lvl1 Roundup-list--variations" id="id-2">content</ul>`
      );
    });
  });
});
