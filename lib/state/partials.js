"use strict";

const path = require("path");
const readDir = require("fs-readdir-recursive");
const { getOnlyWantedFiles } = require("./_helpers.js");

function getFilePaths(app) {
  const paths = readDir(
    path.join(process.cwd(), app.get("config").srcFolder)
  ).filter((file) =>
    getOnlyWantedFiles(app, file, app.get("config").templates.extension, true)
  );

  return paths;
}

module.exports = function getPartials(app) {
  const partials = {};

  getFilePaths(app).forEach((shortPath) => {
    if (shortPath === path.basename(shortPath)) return; // ignore files that live directly in the srcFolder

    partials[shortPath] = path.join(
      process.cwd(),
      `${app.get("config").srcFolder}/${shortPath}`
    );
  });

  return partials;
};
