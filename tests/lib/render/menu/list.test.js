const list = require("../../../../lib/render/menu/list.js");

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/list", () => {
  describe("without id", () => {
    test("renders the correct list html without id", () => {
      expect(list.render("variations", 1, null, "content")).toEqual(
        `<ul class="Freitag-list Freitag-list--lvl1 Freitag-list--variations">content</ul>`
      );
    });
  });

  describe("without id", () => {
    test("renders the correct list html with id", () => {
      expect(list.render("variations", 1, "id-2", "content")).toEqual(
        `<ul class="Freitag-list Freitag-list--lvl1 Freitag-list--variations" id="id-2">content</ul>`
      );
    });
  });
});
