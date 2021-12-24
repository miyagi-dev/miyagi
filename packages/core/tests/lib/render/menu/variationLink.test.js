import { render as renderVariationLink } from "../../../../lib/render/menu/variation-link.js";

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/variation-link", () => {
  describe("with current === true", () => {
    test("renders the correct variationLink html", () => {
      expect(
        renderVariationLink(
          false,
          { index: 1, shortPath: "foo/bar" },
          { name: "baz" },
          true
        )
      ).toEqual(
        `<a class="Menu-link Menu-link--lvl1 Menu-link--variation" target="iframe" href="/component?file=foo/bar&variation=baz&embedded=true" aria-current="page">baz</a>`
      );
    });
  });

  describe("with current === false", () => {
    test("renders the correct variationLink html", () => {
      expect(
        renderVariationLink(
          false,
          { index: 1, shortPath: "foo/bar" },
          { name: "baz" },
          false
        )
      ).toEqual(
        `<a class="Menu-link Menu-link--lvl1 Menu-link--variation" target="iframe" href="/component?file=foo/bar&variation=baz&embedded=true">baz</a>`
      );
    });
  });
});
