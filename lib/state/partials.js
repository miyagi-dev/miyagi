"use strict";

const path = require("path");
const readDir = require("fs-readdir-recursive");
const { isNotIgnored } = require("./_helpers.js");

function getFilePaths(app) {
  const paths = readDir(
    path.join(process.cwd(), app.get("config").components.folder)
  ).filter((file) => {
    return (
      isNotIgnored(file, app.get("config").components.ignores) &&
      path.basename(file) ==
        `index.${app.get("config").files.templates.extension}`
    );
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
