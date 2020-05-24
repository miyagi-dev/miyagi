"use strict";

const path = require("path");
const config = require("../config.json");
const log = require("../logger.js");

function isNotIgnored(file, ignoredFolders) {
  for (let i = 0; i < ignoredFolders.length; i += 1) {
    if (
      path
        .join(process.cwd(), file)
        .indexOf(path.join(process.cwd(), ignoredFolders[i])) === 0
    ) {
      return false;
    }
  }

  return true;
}

module.exports = {
  isNotIgnored,
};
