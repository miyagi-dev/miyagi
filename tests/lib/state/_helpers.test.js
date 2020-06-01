const helpers = require("../../../lib/state/helpers.js");

jest.mock("../../../lib/logger");

describe("lib/state/helpers", () => {
  describe("isNotIgnored()", () => {
    const ignoredFolders = ["foo/bar"];

    describe("for file that is not in an ignored folder", () => {
      test("returns true", () => {
        expect(helpers.isNotIgnored("foo/index.hbs", ignoredFolders)).toBe(
          true
        );
        expect(helpers.isNotIgnored("bar/baz/index.hbs", ignoredFolders)).toBe(
          true
        );
      });
    });

    describe("for file that is in an ignored folder", () => {
      test("returns false", () => {
        expect(helpers.isNotIgnored("foo/bar/index.hbs", ignoredFolders)).toBe(
          false
        );
      });
    });
  });
});
