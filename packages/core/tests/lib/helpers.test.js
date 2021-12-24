import deepMerge from "deepmerge";
import config from "../../lib/miyagi-config.js";
import express from "express";
import {
  fileIsDataFile,
  fileIsTemplateFile,
  fileIsDocumentationFile,
  fileIsSchemaFile,
  getFullPathFromShortPath,
} from "../../lib/helpers.js";

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

describe("lib/helpers", () => {
  const app = express();
  app.set(
    "config",
    deepMerge(config.defaultUserConfig, {
      components: {
        folder: "srcFolder",
      },
      files: {
        templates: { extension: "hbs" },
      },
    })
  );

  describe("fileIsDataFile()", () => {
    test("returns true if file is a data file", () => {
      expect(
        fileIsDataFile(
          app,
          `foo/${app.get("config").files.mocks.name}.${
            app.get("config").files.mocks.extension
          }`
        )
      ).toBe(true);
    });

    test("returns true if file is not a data file", () => {
      expect(
        fileIsDataFile(
          app,
          `foo/${app.get("config").files.mocks.name}.${
            app.get("config").files.mocks.name
          }!`
        )
      ).toBe(false);
    });
  });

  describe("fileIsTemplateFile()", () => {
    test("returns true if file is a template file", () => {
      expect(
        fileIsTemplateFile(
          app,
          `foo/${app.get("config").files.templates.name}.${
            app.get("config").files.templates.extension
          }`
        )
      ).toBe(true);
    });

    test("returns true if file is not a template file", () => {
      expect(
        fileIsTemplateFile(
          app,
          `foo/${app.get("config").files.templates.name}.${
            app.get("config").files.templates.name
          }!`
        )
      ).toBe(false);
    });
  });

  describe("fileIsDocumentationFile()", () => {
    test("returns true if file is a docs file", () => {
      expect(
        fileIsDocumentationFile(
          app,
          `foo/${app.get("config").files.docs.name}.${
            app.get("config").files.docs.extension
          }`
        )
      ).toBe(true);
    });

    test("returns true if file is not a docs file", () => {
      expect(
        fileIsDocumentationFile(
          app,
          `foo/${app.get("config").files.docs.name}.${
            app.get("config").files.docs.name
          }!`
        )
      ).toBe(false);
    });
  });

  describe("fileIsSchemaFile()", () => {
    test("returns true if file is a schema file", () => {
      expect(
        fileIsSchemaFile(
          app,
          `foo/${app.get("config").files.schema.name}.${
            app.get("config").files.schema.extension
          }`
        )
      ).toBe(true);
    });

    test("returns true if file is not a schema file", () => {
      expect(
        fileIsSchemaFile(
          app,
          `foo/${app.get("config").files.schema.name}.${
            app.get("config").files.schema.name
          }!`
        )
      ).toBe(false);
    });
  });

  describe("getFullPathFromShortPath()", () => {
    test("prepends process.cwd() and the components.folder to a path", () => {
      expect(getFullPathFromShortPath(app, "/foo/bar")).toEqual(
        `${process.cwd()}/srcFolder/foo/bar`
      );
    });
  });
});
