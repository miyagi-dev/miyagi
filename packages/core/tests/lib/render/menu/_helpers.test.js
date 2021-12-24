import helpers from "../../../../lib/render/menu/helpers.js";

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/menu/elements/helpers", () => {
  describe("pathIsParentOfOrEqualRequestedPath()", () => {
    describe("child is a not file", () => {
      describe("path is parent of child", () => {
        test("returns true", () => {
          expect(
            helpers.pathIsParentOfOrEqualRequestedPath("foo/bar", "foo/bar/baz")
          ).toBe(true);
        });
      });

      describe("path is same as child", () => {
        test("returns false", () => {
          expect(
            helpers.pathIsParentOfOrEqualRequestedPath(
              "foo/bar/baz",
              "foo/bar/baz"
            )
          ).toBe(true);
        });
      });
    });

    describe("paths are completely different", () => {
      test("returns false", () => {
        expect(
          helpers.pathIsParentOfOrEqualRequestedPath(
            "foo/bar/baz/foo",
            "bar/baz/foo/bar",
            true
          )
        ).toBe(false);
      });
    });
  });

  describe("pathEqualsRequest()", () => {
    describe("path is same as request path", () => {
      const path = "foo/bar";
      const variation = {
        name: "variation",
      };
      const request = {
        path,
      };

      describe("variation is same as request variation", () => {
        test("returns true", () => {
          expect(
            helpers.pathEqualsRequest(path, variation, {
              ...request,
              variation: variation.name,
            })
          ).toBe(true);
        });
      });

      describe("variation is not same as request variation", () => {
        test("returns false", () => {
          expect(helpers.pathEqualsRequest(path, variation, request)).toBe(
            false
          );
        });
      });
    });

    describe("path is not same as request path", () => {
      const path = "foo/bar";
      const request = {
        path: "foo/baz",
      };

      test("returns false", () => {
        expect(helpers.pathEqualsRequest(path, "", request)).toBe(false);
      });
    });
  });

  describe("childrenOfDirectoryContainDirectory()", () => {
    describe("with children containing a directory", () => {
      test("returns true", () => {
        expect(
          helpers.childrenOfDirectoryContainDirectory({
            children: [{ type: "directory" }],
          })
        ).toBe(true);
      });
    });

    describe("with children not containing a directory", () => {
      test("returns false", () => {
        expect(helpers.childrenOfDirectoryContainDirectory({})).toBeFalsy();
        expect(
          helpers.childrenOfDirectoryContainDirectory({ children: undefined })
        ).toBeFalsy();
        expect(
          helpers.childrenOfDirectoryContainDirectory({ children: [] })
        ).toBe(false);
        expect(
          helpers.childrenOfDirectoryContainDirectory({
            children: [{ type: "file" }],
          })
        ).toBe(false);
      });
    });
  });

  describe("componentHasVariations()", () => {
    describe("with variations", () => {
      test("returns true", () => {
        expect(helpers.componentHasVariations({ variations: [{}] })).toBe(true);
      });
    });

    describe("without variations", () => {
      test("returns false", () => {
        expect(helpers.componentHasVariations({})).toBeFalsy();
        expect(
          helpers.componentHasVariations({ variations: undefined })
        ).toBeFalsy();
        expect(helpers.componentHasVariations({ variations: [] })).toBe(false);
      });
    });
  });

  describe("directoryIsNotTopLevel()", () => {
    describe("index >= 1", () => {
      test("returns true", () => {
        expect(helpers.directoryIsNotTopLevel({ index: 1 })).toBe(true);
      });
    });

    describe("is not top level", () => {
      test("index < 1", () => {
        expect(helpers.directoryIsNotTopLevel({ index: 0 })).toBe(false);
      });
    });
  });

  describe("directoryHasComponent()", () => {
    describe("has shortPath", () => {
      test("returns true", () => {
        expect(helpers.directoryHasComponent({ shortPath: "foo" })).toBe(true);
      });
    });

    describe("doesn't have a shortPath", () => {
      test("returns false", () => {
        expect(helpers.directoryHasComponent({})).toBeFalsy();
        expect(
          helpers.directoryHasComponent({ shortPath: undefined })
        ).toBeFalsy();
        expect(helpers.directoryHasComponent({ shortPath: "" })).toBe(false);
      });
    });
  });
});
