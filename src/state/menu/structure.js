const fs = require("fs");
const path = require("path");
const config = require("../../config.json");
const logger = require("../../logger.js");
const helpers = require("../../helpers.js");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

function handleFileResult(app, json, obj, fullPath, jsonChild) {
  const variations = json.variations;
  const shortPath = helpers.getShortPathFromFullPath(app, fullPath);

  if (
    variations &&
    variations.length &&
    obj.name === path.basename(jsonChild.name, `.${config.dataFileType}`)
  ) {
    if (json.data) {
      obj.variations = [{ name: obj.name, data: json.data }].concat(variations);
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
              .replace("${file}", shortPath)
          );
        } else {
          logger.log(
            "warn",
            config.messages.noDataSetForVariation
              .replace("${variation}", variation.name)
              .replace("${file}", shortPath)
          );
        }
        return false;
      }
    });
  }

  return obj;
}

async function getFileContent(app, obj, jsonChild) {
  const fullPath = jsonChild.path;
  const shortPath = helpers.getShortPathFromFullPath(app, fullPath);
  let result;

  if (app.get("cache") && app.get("cache")[fullPath]) {
    result = app.get("cache")[fullPath];
  } else {
    try {
      result = await readFileAsync(fullPath, "utf8");
      result = JSON.parse(result) || {};
    } catch (e) {
      logger.log(
        "warn",
        config.messages.fileNotFound.replace("${filePath}", shortPath)
      );
    }
  }

  if (result) {
    obj = handleFileResult(app, result, obj, fullPath, jsonChild);
  }

  return obj;
}

async function addVariations(app, obj) {
  const jsonChild = obj.children.filter(
    o =>
      path.basename(o.name, `.${config.dataFileType}`) === obj.name &&
      o.extension === `.${config.dataFileType}`
  )[0];
  if (jsonChild) {
    return await getFileContent(app, obj, jsonChild);
  } else {
    return obj;
  }
}

async function updateSourceObject(app, obj) {
  if (obj.children) {
    obj = await addVariations(app, obj);

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
  const result = await start(app, app.get("state").sourceTree);

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
