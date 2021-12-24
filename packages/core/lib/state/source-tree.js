/**
 * Module for getting a source tree of the project
 *
 * @module stateSourcetree
 */

import dirTree from "directory-tree";
import path from "path";
import { messages } from "../miyagi-config.js";
import log from "../logger.js";
import { getSingleFileExtension } from "../helpers.js";

/**
 * @param {object} app - the express instance
 * @returns {object} the source tree object
 */
export const getSourceTree = function (app) {
  const exclude = [];

  const { ignores } = app.get("config").components;
  for (const ignore of ignores) {
    exclude.push(new RegExp(ignore));
  }

  const tree = dirTree(
    path.join(process.cwd(), app.get("config").components.folder),
    {
      attributes: ["type"],
      extensions: new RegExp(
        `.(${app.get("config").files.css.extension}|${
          app.get("config").files.docs.extension
        }|${app.get("config").files.js.extension}|${
          app.get("config").files.mocks.extension
        }|${app.get("config").files.schema.extension}|${getSingleFileExtension(
          app.get("config").files.templates.extension
        )})$`
      ),
      exclude,
    }
  );

  if (!tree) {
    log(
      "error",
      messages.srcFolderNotFound.replace(
        "{{directory}}",
        app.get("config").components.folder
      )
    );
  }

  return tree || {};
};
