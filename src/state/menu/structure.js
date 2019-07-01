const dirTree = require("directory-tree");
const fs = require("fs");
const path = require("path");
const config = require("../../config.json");
const logger = require("../../logger.js");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

let tree;

function handleFileResult(data, obj, filePath, jsonChild) {
  const err = null;
  if (err) {
    logger.log(
      "warn",
      config.messages.fileNotFound.replace("${filePath}", filePath)
    );

    return obj;
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
      obj.name === jsonChild.name.replace(`.${config.dataFileType}`, "")
    ) {
      if (json.data) {
        obj.variations = [{ name: obj.name, data: json.data }].concat(
          variations
        );
      } else {
        obj.variations = variations;
      }

      obj.variations = obj.variations.filter((variation, i) => {
        if (variation.name && variation.data) {
          return variation;
        } else {
          if (!variation.name) {
            logger.log(
              "warn",
              config.messages.noNameSetForVariation
                .replace("${i}", i)
                .replace("${file}", filePath.replace(process.cwd(), ""))
            );
          } else {
            logger.log(
              "warn",
              config.messages.noDataSetForVariation
                .replace("${variation}", variation.name)
                .replace("${file}", filePath.replace(process.cwd(), ""))
            );
          }
          return false;
        }
      });
    }

    return obj;
  }
}

async function getFileContent(obj, jsonChild) {
  const filePath = jsonChild.path;

  try {
    const result = await readFileAsync(filePath, "utf8");
    obj = handleFileResult(result, obj, filePath, jsonChild);
  } catch (e) {
    logger.log(
      "warn",
      config.messages.fileNotFound.replace("${filePath}", filePath)
    );
  }

  return obj;
}

async function addVariations(obj) {
  const jsonChild = obj.children.filter(
    o => o.extension === `.${config.dataFileType}`
  )[0];

  if (jsonChild) {
    return await getFileContent(obj, jsonChild);
  } else {
    return obj;
  }
}

async function updateSourceObject(app, obj) {
  if (obj.path) {
    obj.path = obj.path.replace(
      `${process.cwd()}/${app.get("config").srcFolder}`,
      ""
    );
  }

  if (obj.children) {
    obj = await addVariations(obj);

    await Promise.all(
      obj.children.map(async child => {
        await updateSourceObject(app, child);
      })
    );
  }

  return obj;
}

async function start(app, obj) {
  return new Promise(async resolve => {
    resolve(await updateSourceObject(app, obj));
  });
}

module.exports = async function(app) {
  const exclude = [];

  app.get("config").srcFolderIgnores.forEach(ignore => {
    exclude.push(new RegExp(ignore));
  });

  tree = dirTree(
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

  const result = await start(app, tree);

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
  })(result, -1);

  return result && result.children ? result.children : [];
};
