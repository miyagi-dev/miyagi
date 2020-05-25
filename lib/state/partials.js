"use strict";

const path = require("path");
const readDir = require("fs-readdir-recursive");
const { isNotIgnored } = require("./_helpers.js");
const helpers = require("../helpers.js");

function getFilePaths(app) {
  const paths = readDir(
    path.join(process.cwd(), app.get("config").components.folder)
  ).filter((file) => {
    if (isNotIgnored(file, app.get("config").components.ignores)) {
      const { name, extension } = app.get("config").files.templates;

      if (path.extname(file) == `.${extension}`) {
        const basename = path.basename(file, `.${extension}`);
        return basename == helpers.getResolvedFileName(name, basename);
      }
    }
  });

  return paths;
}

module.exports = function getPartials(app) {
  const partials = {};

  const paths = getFilePaths(app);

  for (const shortPath of paths) {
    if (shortPath === path.basename(shortPath)) return; // ignore files that live directly in the srcFolder

    partials[shortPath] = path.join(
      process.cwd(),
      `${app.get("config").components.folder}/${shortPath}`
    );
  }
  return partials;
};
