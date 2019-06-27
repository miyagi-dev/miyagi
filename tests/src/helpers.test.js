const { pathEndsWithExtension } = require("../../src/helpers.js");

describe("helpers", () => {
  describe("pathEndsWithExtension()", () => {
    test("with given filename ending with given extension", () => {
      expect(pathEndsWithExtension("foo/bar.baz", "baz")).toBe(true);
    });

    test("with given filename not ending with given extension", () => {
      expect(pathEndsWithExtension("fo.b", "barz")).toBe(false);
      expect(pathEndsWithExtension("foo/bar.baz", "foo")).toBe(false);
    });
  });
});
