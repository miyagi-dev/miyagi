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

function filterFilesWithoutUnwantedFileType(app, file, fileNames) {
  if (stateHelpers.isNotIgnored(file, app.get("config").components.ignores)) {
    if (fileNames.includes(path.basename(file))) {
      return true;
    }
  }

  return false;
}

function getFilePaths(app) {
  const paths = readDir(
    path.join(process.cwd(), app.get("config").components.folder)
  ).filter((file) =>
    filterFilesWithoutUnwantedFileType(app, file, [
      `${app.get("config").files.docs.name}.${
        app.get("config").files.docs.extension
      }`,
      `${app.get("config").files.mocks.name}.${
        app.get("config").files.mocks.extension
      }`,
      `${app.get("config").files.schema.name}.${
        app.get("config").files.schema.extension
      }`,
      `${app.get("config").files.info.name}.${
        app.get("config").files.info.extension
      }`,
    ])
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

async function getJsFileContent(app, fileName) {
  const file = require(fileName);

  return typeof file == "function" ? await file() : file;
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

async function readFile(app, fileName) {
  let result;

  if (helpers.fileIsDocumentationFile(app, fileName)) {
    result = getConvertedMarkdownFileContent(fileName);
  } else if (
    helpers.fileIsDataFile(app, fileName) &&
    app.get("config").files.mocks.extension == "js"
  ) {
    result = await getJsFileContent(app, fileName);
  } else {
    result = getParsedJsonFileContent(app, fileName);
  }

  return result;
}

module.exports = {
  readFile,
  getFileContents,
};
