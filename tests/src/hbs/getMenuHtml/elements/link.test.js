const link = require("../../../../../src/hbs/getMenuHtml/elements/link.js");

describe("src/hbs/getMenuHtml/elements/link", () => {
  test("renders the correct link html", () => {
    expect(link.render("foo/bar", "bar", ' aria-current="page"', 1)).toEqual(
      `<a class="Roundup-component Roundup-component--lvl1 Roundup-link Roundup-link--lvl1" target="iframe" href="?component=foo/bar&embedded=true" aria-current="page">bar</a>`
    );
  });
});
