const listItem = require("../../../../../src/hbs/getMenuHtml/elements/listItem.js");

describe("src/hbs/getMenuHtml/elements/listItem", () => {
  test("renders the correct listItem html", () => {
    expect(listItem.render({ index: 1 })).toEqual(
      `<li class="Roundup-listItem Roundup-listItem--lvl1">`
    );
  });
});
