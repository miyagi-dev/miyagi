const list = require("../../../../../src/hbs/getMenuHtml/elements/list.js");

describe("src/hbs/getMenuHtml/elements/list", () => {
  describe("without id", () => {
    test("renders the correct list html without id", () => {
      expect(list.render("variations", 1)).toEqual(
        `<ul class="Roundup-list Roundup-list--lvl1 Roundup-list--variations">`
      );
    });
  });

  describe("without id", () => {
    test("renders the correct list html with id", () => {
      expect(list.render("variations", 1, "id-2")).toEqual(
        `<ul class="Roundup-list Roundup-list--lvl1 Roundup-list--variations" id="id-2">`
      );
    });
  });
});
