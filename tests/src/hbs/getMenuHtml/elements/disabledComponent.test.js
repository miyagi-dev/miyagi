const disabledComponent = require("../../../../../src/hbs/getMenuHtml/elements/disabledComponent.js");

describe("src/hbs/getMenuHtml/elements/disabledComponent", () => {
  test("renders the correct disabledComponent html", () => {
    expect(disabledComponent.render({ name: "foo", index: 1 })).toEqual(
      `<span class="Roundup-component Roundup-component--lvl1">foo</span>`
    );
  });
});
