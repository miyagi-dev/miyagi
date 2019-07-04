const path = require("path");
const fs = require("fs");
const readDir = require("fs-readdir-recursive");
const config = require("../config.json");
const helpers = require("../helpers.js");
const stateHelpers = require("./helpers.js");
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

  if (!app.get("state")) {
    app.set("state", {});
  }

  if (!app.get("state").data) {
    app.set("state", Object.assign({}, app.get("state"), { data: {} }));
  }

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
  if (app.get("state").data[fileName]) {
    return app.get("state").data[fileName];
  }

  return await storeFileContentInCache(app, fileName);
}

async function storeFileContentInCache(app, fileName) {
  let result;

  try {
    result = await readFileAsync(fileName, "utf8");

    if (result) {
      const data = app.get("state").data ? app.get("state").data : {};
      result = result ? JSON.parse(result) : {};

      data[fileName] = result;

      app.set(
        "state",
        Object.assign(app.get("state"), {
          data
        })
      );
    } else {
      result = {};
    }
  } catch (e) {
    result = {};
  }

  return result;
}

function removeFileFromCache(app, fullPath) {
  const data = app.get("state").data;

  delete data[fullPath];

  app.set(
    "state",
    Object.assign(app.get("state"), {
      data
    })
  );
}

module.exports = {
  getData,
  storeFileContentInCache,
  removeFileFromCache
};
