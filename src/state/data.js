const path = require("path");
const fs = require("fs");
const config = require("../config.json");

async function getData(app) {
  const jsonData = {};
  const promises = [];

  if (!app.get("cache")) {
    app.set("cache", {});
  }

  Object.keys(app.get("state").partials).forEach(filePath => {
    promises.push(
      new Promise(resolve => {
        const jsonPath = `${app.get("config").srcFolder}/${filePath.replace(
          `.${app.get("config").extension}`,
          `.${config.dataFileType}`
        )}`;

        getFile(
          app,
          path.join(process.cwd(), jsonPath.replace(/\0/g, "")),
          (err, data) => {
            jsonData[filePath] = data;
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
  fs.readFile(fileName, "utf8", (err, result) => {
    const cache = {};
    let data;

    if (err) {
      data = {};
    } else {
      data = JSON.parse(result);
    }

    cache[fileName] = data;

    app.set("cache", Object.assign(app.get("cache"), cache));

    return cb(null, data);
  });
}

module.exports = {
  getData,
  storeFileContentInCache
};
