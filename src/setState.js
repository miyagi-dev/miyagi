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
      function removeCustomPath(obj) {
        if (obj) {
          if (obj.type === "directory" && obj.children.length) {
            const jsonChild = obj.children.filter(
              o => o.extension === `.${config.dataFileType}`
            )[0];
            let fileData;

            if (jsonChild) {
              const filePath = jsonChild.path;

              try {
                fileData = fs.readFileSync(filePath, "utf8");
              } catch (e) {
                console.warn(
                  config.messages.fileNotFound.replace("${filePath}", filePath)
                );
              }

              if (fileData) {
                const json = JSON.parse(fileData, "utf8");
                const variations = json.variations;

                if (
                  variations &&
                  obj.name ===
                    jsonChild.name.replace(`.${config.dataFileType}`, "")
                ) {
                  obj.variations = [{ name: obj.name, data: json.data }].concat(
                    variations
                  );
                }
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

function getJsonData(app, paths) {
  const jsonData = {};

  paths.forEach(filePath => {
    const jsonPath = `${app.get("config").srcFolder}/${filePath.replace(
      `.${app.get("config").extension}`,
      `.${config.dataFileType}`
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
