const config = require("./config.json");
const readDir = require("fs-readdir-recursive");
const dirTree = require("directory-tree");
const fs = require("fs");
const path = require("path");
const { pathEndsWithExtension } = require("./helpers.js");

function fileIsInFolderWithSameName(file, ext) {
  const isValid = path.dirname(file).endsWith(path.basename(file, `.${ext}`));

  if (!isValid) {
    console.warn(
      config.messages.fileNotRenderedDueToUnmatchingFolderName.replace(
        "${file}",
        file
      )
    );
  }

  return isValid;
}

function filterUnwantedFilePath(app, file) {
  if (
    pathEndsWithExtension(file, app.get("config").extension) &&
    fileIsInFolderWithSameName(file, app.get("config").extension)
  ) {
    return true;
  }
  return false;
}

function getFilePaths(app) {
  const paths = readDir(
    path.join(process.cwd(), app.get("config").srcFolder)
  ).filter(file => filterUnwantedFilePath(app, file));

  return paths;
}

function getSourceStructure(app) {
  const tree = dirTree(
    path.join(process.cwd(), app.get("config").srcFolder),
    {
      extensions: new RegExp(
        `.(${app.get("config").extension}|${config.dataFileType})$`
      )
    },
    item => {
      item.shortPath = item.path.replace(
        `${process.cwd()}/${app.get("config").srcFolder}`,
        ""
      );
    }
  );

  if (tree) {
    (function(obj) {
      async function removeCustomPath(obj) {
        if (obj) {
          if (obj.type === "directory" && obj.children.length) {
            const jsonChild = obj.children.filter(
              o => o.extension === `.${config.dataFileType}`
            )[0];

            if (jsonChild) {
              const filePath = jsonChild.path;

              try {
                fs.readFile(filePath, "utf8", (err, data) => {
                  if (err) {
                    console.warn(
                      config.messages.fileNotFound.replace(
                        "${filePath}",
                        filePath
                      )
                    );
                  } else {
                    const json = data ? JSON.parse(data) : {};
                    const variations = json.variations;

                    if (
                      variations &&
                      variations.length &&
                      obj.name ===
                        jsonChild.name.replace(`.${config.dataFileType}`, "")
                    ) {
                      obj.variations = [
                        { name: obj.name, data: json.data }
                      ].concat(variations);
                    }
                  }
                });
              } catch (e) {
                console.warn(
                  config.messages.fileNotFound.replace("${filePath}", filePath)
                );
              }
            }
          }
        } else {
          obj = {};
        }

        Object.keys(obj).forEach(a => {
          switch (typeof obj[a]) {
            case "object":
              removeCustomPath(obj[a]);
              break;
            case "string":
              if (a === "path") {
                obj[a] = obj[a].replace(app.get("config").srcFolder, "");

                if (obj[a].indexOf("/") === 0) {
                  obj[a] = obj[a].replace("/", "");
                }
              }
          }
        });
      }
      removeCustomPath(obj);
    })(tree);
  }

  (function loop(obj, index) {
    obj.index = index;

    if (obj.children) {
      obj.children.forEach(child => {
        const newIndex = child.type === "directory" ? index + 1 : index;
        loop(child, newIndex);
      });
    }
  })(tree, -1);

  return tree.children;
}

async function getJsonData(app, paths) {
  const jsonData = {};
  const promises = [];

  paths.forEach(filePath => {
    promises.push(
      new Promise(resolve => {
        const jsonPath = `${app.get("config").srcFolder}/${filePath.replace(
          `.${app.get("config").extension}`,
          `.${config.dataFileType}`
        )}`;

        try {
          fs.readFile(
            path.join(process.cwd(), jsonPath.replace(/\0/g, "")),
            "utf8",
            function(err, data) {
              jsonData[filePath] = data ? JSON.parse(data) : {};
              resolve();
            }
          );
        } catch (error) {
          jsonData[filePath] = {};
        }
      })
    );
  });

  return await Promise.all(promises).then(() => {
    return jsonData;
  });
}

function getPartials(app, filePaths) {
  const partials = {};

  filePaths.forEach(filePath => {
    partials[filePath] = path.join(
      process.cwd(),
      `${app.get("config").srcFolder}/${filePath}`
    );
  });

  return partials;
}

async function setState(app, cb) {
  const srcStructure = getSourceStructure(app);
  const filePaths = getFilePaths(app);
  const jsonData = await getJsonData(app, filePaths);
  const partials = getPartials(app, filePaths);

  app.set("state", {
    srcStructure,
    filePaths,
    jsonData,
    partials
  });

  cb();
}

module.exports = setState;
