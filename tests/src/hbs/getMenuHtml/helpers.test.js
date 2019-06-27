const helpers = require("../../../../src/hbs/getMenuHtml/helpers.js");

describe("src/hbs/getMenuHtml/helpers", () => {
  describe("pathIsChildOfSecondPath()", () => {
    describe("child is a not file", () => {
      describe("path is parent of child", () => {
        test("returns true", () => {
          expect(
            helpers.pathIsChildOfSecondPath("foo/bar", "foo/bar/baz")
          ).toBe(true);
        });
      });

      describe("path is same as child", () => {
        test("returns false", () => {
          expect(
            helpers.pathIsChildOfSecondPath("foo/bar/baz", "foo/bar/baz")
          ).toBe(false);
        });
      });
    });

    describe("child is a file", () => {
      describe("path is parent of child", () => {
        test("returns true", () => {
          expect(
            helpers.pathIsChildOfSecondPath("foo/bar.baz", "foo/bar/baz", true)
          ).toBe(true);
        });
      });

      describe("path is same as child", () => {
        test("returns false", () => {
          expect(
            helpers.pathIsChildOfSecondPath(
              "foo/bar/baz/baz.foo",
              "foo/bar/baz",
              true
            )
          ).toBe(false);
        });
      });
    });

    describe("paths are completely different", () => {
      test("returns false", () => {
        expect(
          helpers.pathIsChildOfSecondPath(
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
        name: "variation"
      };
      const request = {
        path
      };

      describe("variation is same as request variation", () => {
        test("returns true", () => {
          expect(
            helpers.pathEqualsRequest(
              path,
              variation,
              Object.assign({}, request, { variation: variation.name })
            )
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
        path: "foo/baz"
      };

      test("returns false", () => {
        expect(helpers.pathEqualsRequest(path, "", request)).toBe(false);
      });
    });
  });

  describe("childrenOfFolderContainDirectory()", () => {
    describe("with children containing a directory", () => {
      test("returns true", () => {
        expect(
          helpers.childrenOfFolderContainDirectory({
            children: [{ type: "directory" }]
          })
        ).toBe(true);
      });
    });

    describe("with children not containing a directory", () => {
      test("returns false", () => {
        expect(helpers.childrenOfFolderContainDirectory({})).toBe(false);
        expect(
          helpers.childrenOfFolderContainDirectory({ children: undefined })
        ).toBe(false);
        expect(helpers.childrenOfFolderContainDirectory({ children: [] })).toBe(
          false
        );
        expect(
          helpers.childrenOfFolderContainDirectory({
            children: [{ type: "file" }]
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
        expect(helpers.componentHasVariations({})).toBe(false);
        expect(helpers.componentHasVariations({ variations: undefined })).toBe(
          false
        );
        expect(helpers.componentHasVariations({ variations: [] })).toBe(false);
      });
    });
  });

  describe("folderIsNotTopLevel()", () => {
    describe("index >= 1", () => {
      test("returns true", () => {
        expect(helpers.folderIsNotTopLevel({ index: 1 })).toBe(true);
      });
    });

    describe("is not top level", () => {
      test("index < 1", () => {
        expect(helpers.folderIsNotTopLevel({ index: 0 })).toBe(false);
      });
    });
  });

  describe("folderIsComponent()", () => {
    describe("has shortPath", () => {
      test("returns true", () => {
        expect(helpers.folderIsComponent({ shortPath: "foo" })).toBe(true);
      });
    });

    describe("doesn't have a shortPath", () => {
      test("returns false", () => {
        expect(helpers.folderIsComponent({})).toBe(false);
        expect(helpers.folderIsComponent({ shortPath: undefined })).toBe(false);
        expect(helpers.folderIsComponent({ shortPath: "" })).toBe(false);
      });
    });
  });
});
