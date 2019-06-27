const variationLink = require("../../../../../src/hbs/getMenuHtml/elements/variationLink.js");

describe("src/hbs/getMenuHtml/elements/variationLink", () => {
  test("renders the correct variationLink html", () => {
    expect(
      variationLink.render(
        { index: 1, shortPath: "foo/bar" },
        { name: "baz" },
        ' aria-current="true"'
      )
    ).toEqual(
      `<a class="Roundup-link Roundup-link--lvl1 Roundup-link--variation" target="iframe" href="?component=foo/bar&variation=baz&embedded=true" aria-current="true">baz</a>`
    );
  });
});
