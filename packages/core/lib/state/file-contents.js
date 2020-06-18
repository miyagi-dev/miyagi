/**
 * Module for getting the content of all relevant files
 *
 * @module state/file-contents
 */

const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const Markdown = require("markdown-it");
const { promisify } = require("util");
const config = require("../config.json");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const stateHelpers = require("./helpers.js");

const readFileAsync = promisify(fs.readFile);

/**
 * Makes sure a requiring a module does not return a cached version
 *
 * @param {string} module
 * @returns {any}
 */
function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

/**
 * Checks if a given array of file paths includes a given file path
 *
 * @param {string} file
 * @param {Array} fileNames
 * @returns {boolean}
 */
function checkIfFileNamesIncludeFile(file, fileNames) {
  return fileNames.includes(path.basename(file));
}

/**
 * Returns all component and README files from components.folder
 * except for template files
 *
 * @param {object} components - the components object from the config
 * @param {object} files - the files object from the config
 * @returns {string[]} an array of file paths
 */
async function getFilePaths(components, files) {
  return await stateHelpers.getFiles(
    components.folder,
    components.ignores,
    function (res) {
      if (
        checkIfFileNamesIncludeFile(res, [
          `${files.docs.name}.${files.docs.extension}`,
          `${files.mocks.name}.${files.mocks.extension}`,
          `${files.schema.name}.${files.schema.extension}`,
          `${files.info.name}.${files.info.extension}`,
          `data.${files.mocks.extension}`,
          `README.${files.docs.extension}`,
        ])
      ) {
        return res;
      } else {
        return null;
      }
    }
  );
}

/**
 * Calls the export function of a CJS module and returns its return value
 * or returns the return value directly if it is not a funcation
 *
 * @param {string} fileName
 * @returns {any}
 */
async function getJsFileContent(fileName) {
  const file = requireUncached(fileName);

  return typeof file === "function" ? file() : file;
}

/**
 * Returns the content of a YAML file parsed as JSON object
 *
 * @param {object} app - the express instance
 * @param {string} fileName
 * @returns {object}
 */
function getYamlFileContent(app, fileName) {
  let result;

  try {
    result = yaml.safeLoad(fs.readFileSync(fileName, "utf8"));
  } catch (e) {
    result = {};
    log(
      "warn",
      config.messages.jsonFileHasInvalidFormat.replace(
        "{{filePath}}",
        helpers.getShortPathFromFullPath(app, fileName)
      )
    );
  }

  return result;
}

/**
 * Returns the parsed content of a JSON file.
 *
 * @param {object} app - the express instance
 * @param {string} fileName
 * @returns {object}
 */
async function getParsedJsonFileContent(app, fileName) {
  let result;

  try {
    result = await readFileAsync(fileName, "utf8");

    try {
      result = JSON.parse(result);
    } catch (e) {
      result = {};
      log(
        "warn",
        config.messages.jsonFileHasInvalidFormat.replace(
          "{{filePath}}",
          helpers.getShortPathFromFullPath(app, fileName)
        )
      );
    }
  } catch (e) {
    result = {};
    log(
      "warn",
      config.messages.jsonFileHasInvalidFormat.replace(
        "{{filePath}}",
        helpers.getShortPathFromFullPath(app, fileName)
      )
    );
  }

  return result;
}

/**
 * Returns the as HTML rendered content of markdown files.
 *
 * @param {string} fileName
 * @returns {string}
 */
async function getConvertedMarkdownFileContent(fileName) {
  const md = new Markdown({ html: true });
  let result;

  try {
    result = await readFileAsync(fileName, "utf8");

    try {
      result = md.render(result);
    } catch (e) {
      result = "";
    }
  } catch (e) {
    result = "";
  }

  return result;
}

/**
 * Calls different functions getting the file's content based on its type
 * and returns the (converted) file content.
 *
 * @param {object} app - the express instance
 * @param {string} fileName
 * @returns {any}
 */
async function readFile(app, fileName) {
  let result;

  if (path.extname(fileName) === ".yaml") {
    result = getYamlFileContent(app, fileName);
  } else if (helpers.fileIsDocumentationFile(app, fileName)) {
    result = getConvertedMarkdownFileContent(fileName);
  } else if (
    helpers.fileIsDataFile(app, fileName) &&
    app.get("config").files.mocks.extension === "js"
  ) {
    result = await getJsFileContent(fileName);
  } else {
    result = getParsedJsonFileContent(app, fileName);
  }

  return result;
}

/**
 * Returns a promise which will be resolved with an object,
 * including all component files (except for template files)
 * and their content.
 *
 * @param {object} app - the express instance
 * @returns {Promise}
 */
async function getFileContents(app) {
  const fileContents = {};
  const promises = [];
  const paths = await getFilePaths(
    app.get("config").components,
    app.get("config").files
  );

  for (const fullPath of paths) {
    promises.push(
      new Promise((res) => {
        readFile(app, fullPath.replace(/\0/g, "")).then((data) => {
          fileContents[fullPath] = data;
          res();
        });
      })
    );
  }

  return Promise.all(promises).then(() => {
    return fileContents;
  });
}

module.exports = {
  readFile,
  getFileContents,
};
