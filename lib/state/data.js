"use strict";

const path = require("path");
const fs = require("fs");
const readDir = require("fs-readdir-recursive");
const config = require("../config.json");
const helpers = require("../helpers.js");
const stateHelpers = require("./_helpers.js");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

function filterFilesWithoutUnwantedFileType(app, file, extension) {
  if (stateHelpers.isNotIgnored(file, app.get("config").srcFolderIgnores)) {
    if (helpers.fileIsOfGivenType(file, extension)) {
      return true;
    }
  }

  return false;
}

function getFilePaths(app) {
  const paths = readDir(
    path.join(process.cwd(), app.get("config").srcFolder)
  ).filter(file =>
    filterFilesWithoutUnwantedFileType(app, file, config.dataFileType)
  );

  return paths;
}

async function getData(app) {
  const jsonData = {};
  const promises = [];

  getFilePaths(app).forEach(shortPath => {
    promises.push(
      new Promise(async resolve => {
        const fullPath = helpers.getFullPathFromShortPath(app, shortPath);
        const data = await getFile(app, fullPath.replace(/\0/g, ""));
        jsonData[fullPath] = data;
        resolve();
      })
    );
  });

  return await Promise.all(promises).then(() => {
    return jsonData;
  });
}

async function getFile(app, fileName) {
  if (
    app.get("state") &&
    app.get("state").data &&
    app.get("state").data[fileName]
  ) {
    return app.get("state").data[fileName];
  }

  return await readFile(fileName);
}

async function readFile(fileName) {
  let result;

  try {
    result = await readFileAsync(fileName, "utf8");

    try {
      result = JSON.parse(result);
    } catch (e) {
      result = {};
    }
  } catch (e) {
    result = {};
  }

  return result;
}

module.exports = {
  readFile,
  getData
};
