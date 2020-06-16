const path = require("path");
const fs = require("fs");
const log = require("../logger.js");
const helpers = require("../helpers.js");
const { messages } = require("../config.json");

/**
 * Module for creating component files based on the configuration cli params
 * @module generator/component
 * @param {Object} cliParams
 * @param {Object} config - the user's roundup configuration object
 */
module.exports = async function componentGenerator(cliParams, config) {
  const commands = cliParams._.slice(1);

  if (commands.length === 0) {
    log("error", messages.generator.noComponentNameDefined);

    return;
  }

  const [componentNameWithFolder] = commands;
  const componentPath = getFullComponentPath(
    componentNameWithFolder,
    config.components.folder
  );

  createComponentFolder(componentPath)
    .then(async () => {
      await createComponentFiles(config.files, componentPath, cliParams);
      log("success", messages.generator.done);
    })
    .catch(() => {
      log(
        "error",
        messages.generator.unknownError.replace("{{name}}", componentPath)
      );
    });

  /**
   * Returns the component folder path relative from the project root
   * @param {string} componentName
   * @param {Object} componentsFolderPath - the components.folder from the user's roundup config
   * @returns {string}
   */
  function getFullComponentPath(componentName, componentsFolderPath) {
    return path.join(componentsFolderPath, componentName);
  }

  /**
   * Returns an array with file names, if necessary filtered based on args
   * @param {Object} fileNames - an object with file names for the component
   * @param {Object} args - the cli args
   * @returns {Promise}
   */
  function getFiles(fileNames, args) {
    if (args) {
      if (args.skip) {
        const files = [];
        const targets = args.skip.split(",");
        const entries = Object.entries(fileNames);
        for (const [alias, name] of entries) {
          if (!targets.includes(alias)) {
            files.push(name);
          }
        }
        return files;
      }
      if (args.only) {
        return args.only.split(",").map((entry) => fileNames[entry]);
      }
      return Object.values(fileNames);
    }
    return Object.values(fileNames);
  }

  /**
   * Returns the dummy content for a component file
   * @param {stirng} fileType
   * @returns {Promise}
   */
  function getDummyFileContent(fileType) {
    let str;

    switch (fileType) {
      case "data":
        str = JSON.stringify(
          {
            data: {},
            variations: [],
          },
          0,
          2
        );
        break;
      case "info":
        str = JSON.stringify(
          {
            info: "wip",
            name: "",
          },
          0,
          2
        );
        break;
      case "schema":
        str = JSON.stringify(
          {
            $schema: "http://json-schema.org/draft-07/schema",
            required: [],
            properties: {},
          },
          0,
          2
        );
        break;
      default:
        str = "";
    }

    return str;
  }

  /**
   * Creates the component files
   * @param {Object} filesConfig - the files configuration from the user's roundup config
   * @param {string} componentPath - the path of the component folder
   * @param {Object} args - the cli args
   * @returns {Promise}
   */
  function createComponentFiles(filesConfig, componentPath, args) {
    const componentName = path.basename(componentPath);
    const fileNames = getFileNames(filesConfig, componentName);
    const files = getFiles(fileNames, args);
    const entries = Object.entries(fileNames);
    const promises = [];

    for (const [type, file] of entries) {
      if (files.includes(file)) {
        promises.push(
          new Promise((resolve) => {
            const fullFilePath = path.join(componentPath, file);

            fs.writeFile(
              fullFilePath,
              getDummyFileContent(type),
              { flag: "wx" },
              function createComponentFilesCallback(err) {
                if (err) {
                  if (err.code === "EEXIST") {
                    log(
                      "warn",
                      messages.generator.fileAlreadyExists.replace(
                        "{{name}}",
                        fullFilePath
                      )
                    );
                  } else if (err.code !== "ENOENT") {
                    log(
                      "error",
                      messages.generator.unknownError.replace(
                        "{{name}}",
                        fullFilePath
                      )
                    );
                  }
                }

                resolve();
              }
            );
          })
        );
      }
    }

    return Promise.all(promises);
  }

  /**
   * Returns an object with the file names for a given component name
   * @param {Object} filesConfig - the files configuration from the user's roundup config
   * @param {string} componentName - the name of the component
   * @returns {Object}
   */
  function getFileNames(filesConfig, componentName) {
    return {
      tpl: `${helpers.getResolvedFileName(
        filesConfig.templates.name,
        componentName
      )}.${filesConfig.templates.extension}`,
      mocks: `${filesConfig.mocks.name}.${filesConfig.mocks.extension}`,
      docs: `${filesConfig.docs.name}.${filesConfig.docs.extension}`,
      css: `${helpers.getResolvedFileName(
        filesConfig.css.name,
        componentName
      )}.${filesConfig.css.extension}`,
      js: `${helpers.getResolvedFileName(filesConfig.js.name, componentName)}.${
        filesConfig.js.extension
      }`,
      schema: `${filesConfig.schema.name}.${filesConfig.schema.extension}`,
    };
  }

  /**
   * Creates the component folder
   * @param {string} path
   * @returns {Promise}
   */
  function createComponentFolder(path) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, { recursive: true }, function createComponentCallback(
        err
      ) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};
