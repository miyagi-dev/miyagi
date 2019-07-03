const path = require("path");
const fs = require("fs");
const readDir = require("fs-readdir-recursive");
const config = require("../config.json");
const helpers = require("../helpers.js");
const { filterFilesWithoutUnwantedFileType } = require("./helpers.js");

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

  if (!app.get("cache")) {
    app.set("cache", {});
  }

  getFilePaths(app).forEach(shortPath => {
    promises.push(
      new Promise(resolve => {
        const jsonPath = `${app.get("config").srcFolder}${shortPath}`;
        const templatePath = helpers.getTemplatePathFromDataPath(
          app,
          shortPath
        );

        getFile(
          app,
          path.join(process.cwd(), jsonPath.replace(/\0/g, "")),
          (err, data) => {
            jsonData[templatePath] = data;
            resolve();
          }
        );
      })
    );
  });

  return await Promise.all(promises).then(() => {
    return jsonData;
  });
}

function getFile(app, fileName, cb) {
  if (app.get("cache")[fileName]) {
    return cb(null, app.get("cache")[fileName]);
  }

  return storeFileContentInCache(app, fileName, cb);
}

function storeFileContentInCache(app, fileName, cb) {
  try {
    fs.readFile(fileName, "utf8", (err, result) => {
      const cache = {};
      let data;

      if (err) {
        data = {};
      } else {
        data = result ? JSON.parse(result) : {};
      }

      cache[fileName] = data;

      app.set("cache", Object.assign(app.get("cache"), cache));

      return cb(null, data);
    });
  } catch (e) {
    return cb(null, {});
  }
}

module.exports = {
  getData,
  storeFileContentInCache
};
