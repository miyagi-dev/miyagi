const deepMerge = require("deepmerge");
const fs = require("fs");
const path = require("path");
const PhpParser = require("php-parser");

module.exports = function ({ folder, lang }) {
  let locales = {};

  return getFiles(path.join(folder, lang)).then((res) => {
    res
      .flatMap((r) => r)
      .forEach((file) => {
        const convertedFileContent = convertFileContent(fs.readFileSync(file));
        const shortPath = path
          .dirname(file)
          .replace(path.join(folder, lang), "")
          .slice(1);
        const fileName = path.basename(file, ".php");

        locales = deepMerge(
          locales,
          convertArrayToObject(
            shortPath.length > 1
              ? [...shortPath.split("/"), fileName]
              : [fileName],
            convertedFileContent
          )
        );
      });

    return locales;
  });
};

/**
 * @param {Array} keys
 * @param {object} object
 * @returns {object}
 */
function convertArrayToObject(keys, object) {
  var tempObject = {};
  var container = tempObject;

  if (keys) {
    keys.map((k, i, values) => {
      container = container[k] = i == values.length - 1 ? object : {};
    });

    return tempObject;
  }

  return object;
}

/**
 * @param {string} phpString
 * @returns {object}
 */
function convertFileContent(phpString) {
  const Parser = new PhpParser();
  const AST = Parser.parseCode(phpString);
  const result = {};

  if (AST?.children?.length > 0) {
    const returnElem = AST.children.find((el) => el.kind === "return");

    if (returnElem.expr?.kind === "array" && returnElem.expr?.items) {
      (function parseArr(items, parent) {
        items.forEach((item) => {
          if (
            item?.kind === "entry" &&
            item?.key?.kind === "string" &&
            item?.key?.value &&
            item?.value
          ) {
            if (item.value.kind === "string") {
              parent[item.key.value] = item.value.value || "";
            }
            if (item.value.kind === "array" && item.value.items) {
              parent[item.key.value] = {};
              parseArr(item.value.items, parent[item.key.value]);
            }
          }
        });
      })(returnElem.expr.items, result);
    }
  }

  return result;
}

/**
 * @param {object} dir
 * @returns {Promise<string[]>}
 */
async function getFiles(dir) {
  try {
    const entries = await fs.promises.readdir(path.join(process.cwd(), dir), {
      withFileTypes: true,
    });

    const files = await Promise.all(
      entries.map(async (entry) => {
        if (entry.isDirectory()) {
          return await getFiles(path.join(dir, entry.name));
        } else {
          return path.join(dir, entry.name);
        }
      })
    );

    return Array.prototype.concat(...files).filter((file) => file !== null);
  } catch (e) {
    return [];
  }
}
