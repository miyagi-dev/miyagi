const dirTree = require("directory-tree");
const fs = require("fs");
const path = require("path");
const config = require("../config.json");
const logger = require("../logger.js");

module.exports = function(app) {
  const exclude = [];

  app.get("config").srcFolderIgnores.forEach(ignore => {
    exclude.push(new RegExp(ignore));
  });

  const tree = dirTree(
    path.join(process.cwd(), app.get("config").srcFolder),
    {
      extensions: new RegExp(
        `.(${app.get("config").extension}|${config.dataFileType})$`
      ),
      exclude
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
                    logger.log(
                      "warn",
                      config.messages.fileNotFound.replace(
                        "${filePath}",
                        filePath
                      )
                    );
                  } else {
                    let json;
                    try {
                      json = data ? JSON.parse(data) : {};
                    } catch (e) {
                      json = {};
                    }
                    const variations = json.variations;

                    if (
                      variations &&
                      variations.length &&
                      obj.name ===
                        jsonChild.name.replace(`.${config.dataFileType}`, "")
                    ) {
                      if (json.data) {
                        obj.variations = [
                          { name: obj.name, data: json.data }
                        ].concat(variations);
                      } else {
                        obj.variations = variations;
                      }
                    }
                  }
                });
              } catch (e) {
                logger.log(
                  "warn",
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
    if (obj) {
      obj.index = index;

      if (obj.children) {
        obj.children.forEach(child => {
          const newIndex = child.type === "directory" ? index + 1 : index;
          loop(child, newIndex);
        });
      }
    }
  })(tree, -1);

  return tree && tree.children ? tree.children : [];
};
