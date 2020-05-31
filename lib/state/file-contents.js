const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const Markdown = require("markdown-it");
const { promisify } = require("util");
const config = require("../config.json");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const stateHelpers = require("./_helpers.js");

const readFileAsync = promisify(fs.readFile);

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

function filterFilesWithoutUnwantedFileType(app, file, fileNames) {
  return fileNames.includes(path.basename(file));
}

async function getFilePaths(app) {
  return await stateHelpers.getFiles(
    app,
    app.get("config").components.folder,
    function(res) {
      if (
        filterFilesWithoutUnwantedFileType(app, res, [
          `${app.get("config").files.docs.name}.${
            app.get("config").files.docs.extension
          }`,
          `${app.get("config").files.mocks.name}.${
            app.get("config").files.mocks.extension
          }`,
          `${app.get("config").files.schema.name}.${
            app.get("config").files.schema.extension
          }`,
          `${app.get("config").files.info.name}.${
            app.get("config").files.info.extension
          }`,
          `data.${app.get("config").files.mocks.extension}`,
        ])
      ) {
        return res;
      } else {
        return null;
      }
    }
  );
}

async function getJsFileContent(app, fileName) {
  const file = requireUncached(fileName);

  return typeof file === "function" ? file() : file;
}

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

async function getConvertedMarkdownFileContent(fileName) {
  const md = new Markdown();
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
    result = await getJsFileContent(app, fileName);
  } else {
    result = getParsedJsonFileContent(app, fileName);
  }

  return result;
}

async function getFileContents(app) {
  const fileContents = {};
  const promises = [];
  const paths = await getFilePaths(app);

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
