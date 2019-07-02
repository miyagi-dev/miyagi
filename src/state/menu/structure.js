const fs = require("fs");
const config = require("../../config.json");
const logger = require("../../logger.js");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

function handleFileResult(json, obj, filePath, jsonChild) {
  const variations = json.variations;

  if (
    variations &&
    variations.length &&
    obj.name === jsonChild.name.replace(`.${config.dataFileType}`, "")
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

async function getFileContent(app, obj, jsonChild) {
  const filePath = jsonChild.path;
  const shortPath = filePath.replace(
    `${process.cwd()}/${app.get("config").srcFolder}`,
    ""
  );
  let result;

  if (app.get("cache") && app.get("cache")[filePath]) {
    result = app.get("cache")[filePath];
  } else {
    try {
      result = await readFileAsync(filePath, "utf8");
      result = JSON.parse(result) || {};
    } catch (e) {
      logger.log(
        "warn",
        config.messages.fileNotFound.replace("${filePath}", shortPath)
      );
    }
  }

  if (result) {
    obj = handleFileResult(result, obj, filePath, jsonChild);
  }

  return obj;
}

async function addVariations(app, obj) {
  const jsonChild = obj.children.filter(
    o => o.extension === `.${config.dataFileType}`
  )[0];

  if (jsonChild) {
    return await getFileContent(app, obj, jsonChild);
  } else {
    return obj;
  }
}

async function updateSourceObject(app, obj) {
  // if (obj.path) {
  //   obj.path = obj.path.replace(
  //     `${process.cwd()}/${app.get("config").srcFolder}`,
  //     ""
  //   );
  // }

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
