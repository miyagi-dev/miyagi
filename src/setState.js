const readDir = require("fs-readdir-recursive");
const dirTree = require("directory-tree");
const fs = require("fs");
const path = require("path");
const {
  pathEndsWithExtension,
  fileIsInFolderWithSameName
} = require("./extensionHelper.js");

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
      extensions: new RegExp(`.(${app.get("config").extension}|json)$`)
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
      function removeCustomPath(obj) {
        if (obj.type === "directory" && obj.children.length) {
          const jsonChild = obj.children.filter(
            o => o.extension === ".json"
          )[0];
          let fileData;

          if (jsonChild) {
            const filePath = jsonChild.path;

            try {
              fileData = fs.readFileSync(filePath, "utf8");
            } catch (e) {
              console.warn(
                `Couldn't find file ${filePath}. Is the 'srcFolder' in your styleguide.json correct?`
              );
            }

            if (fileData) {
              const json = JSON.parse(fileData, "utf8");
              const variations = json.variations;

              if (
                variations &&
                obj.name === jsonChild.name.replace(".json", "")
              ) {
                obj.variations = [{ name: obj.name, data: json.data }].concat(
                  variations
                );
              }
            }
          }
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

  return tree;
}

function getJsonData(app, paths) {
  const jsonData = {};

  paths.forEach(filePath => {
    const jsonPath = `${app.get("config").srcFolder}/${filePath.replace(
      `.${app.get("config").extension}`,
      ".json"
    )}`;

    try {
      jsonData[filePath] = JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), jsonPath.replace(/\0/g, "")),
          "utf8"
        )
      );
    } catch (error) {
      jsonData[filePath] = {};
    }
  });

  return jsonData;
}

function setState(app) {
  const srcStructure = getSourceStructure(app);
  const filePaths = getFilePaths(app);
  const jsonData = getJsonData(app, filePaths);

  app.set("state", {
    srcStructure,
    filePaths,
    jsonData
  });
}

module.exports = setState;
