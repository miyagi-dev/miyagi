const helpersSrc = "../../../../../src/hbs/getMenuHtml/helpers.js";

function requireComponent(componentName, mock) {
  let component = require(`../../../../../src/hbs/getMenuHtml/elements/${componentName}`);

  if (mock) {
    component.render = jest.fn(() => `${componentName}Html`);
  }

  return component;
}

describe("src/hbs/getMenuHtml/elements/folder", () => {
  const path = "foo/bar";
  const id = "id";
  const index = "index";
  const folderObject = {
    path,
    id,
    index
  };
  const request = {
    path: "foo/bar",
    variation: "baz"
  };

  describe("is a component", () => {
    test("calls componentFolder.render with the correct params", () => {
      const folder = requireComponent("folder");
      const componentFolder = requireComponent("componentFolder", true);

      const helpers = require(helpersSrc);
      helpers.folderIsComponent = jest.fn(() => true);

      folder.render(folderObject, request);

      expect(componentFolder.render).toHaveBeenCalledWith(
        folderObject,
        request
      );
    });

    test("adds the componentFolder html to the return value", () => {
      const folder = requireComponent("folder");
      requireComponent("componentFolder", true);

      const helpers = require(helpersSrc);
      helpers.folderIsComponent = jest.fn(() => true);

      expect(
        folder.render(folderObject, request).indexOf("componentFolder")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("has variations", () => {
      test("calls variations.render with the correct params", () => {
        const folder = requireComponent("folder");
        const variations = requireComponent("variations", true);

        const helpers = require(helpersSrc);
        helpers.folderIsComponent = jest.fn(() => true);
        helpers.componentHasVariations = jest.fn(() => true);

        folder.render(folderObject, request);

        expect(variations.render).toHaveBeenCalledWith(folderObject, request);
      });

      test("adds the variations html to the return value", () => {
        const folder = requireComponent("folder");
        requireComponent("variations", true);

        const helpers = require(helpersSrc);
        helpers.folderIsComponent = jest.fn(() => true);
        helpers.componentHasVariations = jest.fn(() => true);

        expect(
          folder.render(folderObject, request).indexOf("variationsHtml")
        ).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("is not a component", () => {
    test("calls disabledComponent.render with the correct params", () => {
      const folder = requireComponent("folder");
      const disabledComponent = requireComponent("disabledComponent", true);

      const helpers = require(helpersSrc);
      helpers.folderIsComponent = jest.fn(() => false);

      folder.render(folderObject, request);

      expect(disabledComponent.render).toHaveBeenCalledWith(folderObject);
    });

    test("adds the disabledComponent html to the return value", () => {
      const folder = requireComponent("folder");
      requireComponent("disabledComponent", true);

      const helpers = require(helpersSrc);
      helpers.folderIsComponent = jest.fn(() => false);

      expect(
        folder.render(folderObject, request).indexOf("disabledComponentHtml")
      ).toBeGreaterThanOrEqual(0);
    });

    describe("has directory as child and is not in the first level", () => {
      describe("when expanded", () => {
        test("calls toggle.render with the correct params", () => {
          const folder = requireComponent("folder");
          const toggle = requireComponent("toggle", true);

          const helpers = require(helpersSrc);
          helpers.folderIsComponent = jest.fn(() => false);
          helpers.childrenOfFolderContainDirectory = jest.fn(() => true);
          helpers.folderIsNotTopLevel = jest.fn(() => true);
          helpers.pathIsChildOfSecondPath = jest.fn(() => true);

          folder.render(folderObject, request);

          expect(toggle.render).toHaveBeenCalledWith(
            folderObject.id,
            true,
            folderObject.index
          );
        });
      });

      describe("when not expanded", () => {
        test("calls toggle.render with the correct params", () => {
          const folder = requireComponent("folder");
          const toggle = requireComponent("toggle", true);

          const helpers = require(helpersSrc);
          helpers.folderIsComponent = jest.fn(() => false);
          helpers.childrenOfFolderContainDirectory = jest.fn(() => true);
          helpers.folderIsNotTopLevel = jest.fn(() => true);
          helpers.pathIsChildOfSecondPath = jest.fn(() => false);

          folder.render(folderObject, request);

          expect(toggle.render).toHaveBeenCalledWith(
            folderObject.id,
            false,
            folderObject.index
          );
        });
      });

      test("adds the toggle html to the return value", () => {
        const folder = requireComponent("folder");
        requireComponent("toggle", true);

        const helpers = require(helpersSrc);
        helpers.folderIsComponent = jest.fn(() => false);
        helpers.childrenOfFolderContainDirectory = jest.fn(() => true);
        helpers.folderIsNotTopLevel = jest.fn(() => true);

        expect(
          folder.render(folderObject, request).indexOf("toggleHtml")
        ).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
