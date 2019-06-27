const toggle = require("../../../../../src/hbs/getMenuHtml/elements/toggle.js");

describe("src/hbs/getMenuHtml/elements/toggle", () => {
  test("renders the correct toggle html", () => {
    expect(toggle.render(1, true, 2)).toEqual(
      `<button class="Roundup-toggle Roundup-toggle--lvl2" aria-controls="1" aria-expanded="true" title="Toggle submenu"></button>`
    );
  });
});
