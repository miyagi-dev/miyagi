"use strict";

const path = require("path");
const fs = require("fs");
const Markdown = require("markdown-it");
const readDir = require("fs-readdir-recursive");
const config = require("../config.json");
const helpers = require("../helpers.js");
const logger = require("../logger.js");
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
  ).filter(
    (file) =>
      filterFilesWithoutUnwantedFileType(
        app,
        file,
        config.documentationFileType
      ) ||
      filterFilesWithoutUnwantedFileType(app, file, config.dataFileType) ||
      filterFilesWithoutUnwantedFileType(app, file, config.schemaFile.type)
  );
  return paths;
}

async function getFileContents(app) {
  const fileContents = {};
  const promises = [];

  getFilePaths(app).forEach((shortPath) => {
    promises.push(
      new Promise(async (resolve) => {
        const fullPath = helpers.getFullPathFromShortPath(app, shortPath);
        const data = await readFile(app, fullPath.replace(/\0/g, ""));
        fileContents[fullPath] = data;
        resolve();
      })
    );
  });

  return await Promise.all(promises).then(() => {
    return fileContents;
  });
}

async function getParsedJsonFileContent(app, fileName) {
  var result;

  try {
    result = await readFileAsync(fileName, "utf8");

    try {
      result = JSON.parse(result);
    } catch (e) {
      result = {};
      logger.log(
        "warn",
        config.messages.jsonFileHasInvalidFormat.replace(
          "${filePath}",
          helpers.getShortPathFromFullPath(app, fileName)
        )
      );
    }
  } catch (e) {
    result = {};
    logger.log(
      "warn",
      config.messages.jsonFileHasInvalidFormat.replace(
        "${filePath}",
        helpers.getShortPathFromFullPath(app, fileName)
      )
    );
  }

  return result;
}

async function getConvertedMarkdownFileContent(fileName) {
  const md = new Markdown();
  var result;

  try {
    result = await readFileAsync(fileName, "utf8");

    try {
      result = md.render(result);
    } catch (e) {
      result = "";
    }
  } catch (e) {
    result = "";
  }

  return result;
}

function readFile(app, fileName) {
  let result;

  if (helpers.fileIsDocumentationFile(fileName)) {
    result = getConvertedMarkdownFileContent(fileName);
  } else {
    result = getParsedJsonFileContent(app, fileName);
  }

  return result;
}

module.exports = {
  readFile,
  getFileContents,
};
