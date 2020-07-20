const path = require("path");
const fs = require("fs");
const log = require("../logger.js");
const helpers = require("../helpers.js");
const { messages } = require("../config.json");

/**
 * Module for creating component files based on the configuration cli params
 *
 * @module generator/component
 * @param {object} cliParams
 * @param {object} config - the user's miyagi configuration object
 */
module.exports = async function componentGenerator(cliParams, config) {
  const commands = cliParams._.slice(1);

  if (commands.length === 0) {
    log("error", messages.generator.noComponentNameDefined);

    return;
  }

  const [componentNameWithFolder] = commands;

  createComponentFolder(componentNameWithFolder)
    .then(async () => {
      await createComponentFiles(
        config.files,
        componentNameWithFolder,
        cliParams
      );
      log("success", messages.generator.done);
    })
    .catch(() => {
      log(
        "error",
        messages.generator.unknownError.replace(
          "{{name}}",
          componentNameWithFolder
        )
      );
    });

  /**
   * Returns an array with file names, if necessary filtered based on args
   *
   * @param {object} fileNames - an object with file names for the component
   * @param {object} args - the cli args
   * @returns {Promise}
   */
  function getFiles(fileNames, args) {
    if (args) {
      if (args.skip) {
        const files = [];
        const entries = Object.entries(fileNames);
        for (const [alias, name] of entries) {
          if (!args.skip.includes(alias)) {
            files.push(name);
          }
        }
        return files;
      }
      if (args.only) {
        return args.only.map((entry) => fileNames[entry]);
      }
      return Object.values(fileNames);
    }
    return Object.values(fileNames);
  }

  /**
   * Returns the dummy content for a component file
   *
   * @param {string} fileType
   * @returns {Promise}
   */
  function getDummyFileContent(fileType) {
    let str;

    switch (fileType) {
      case "mocks":
        str = JSON.stringify(
          {
            $variants: [
              {
                $name: "",
              },
            ],
          },
          0,
          2
        );
        break;
      case "info":
        str = JSON.stringify(
          {
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

    return `${str}\n`;
  }

  /**
   * Creates the component files
   *
   * @param {object} filesConfig - the files configuration from the user's miyagi config
   * @param {string} componentPath - the path of the component folder
   * @param {object} args - the cli args
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
   *
   * @param {object} filesConfig - the files configuration from the user's miyagi config
   * @param {string} componentName - the name of the component
   * @returns {object}
   */
  function getFileNames(filesConfig, componentName) {
    return {
      tpl: `${helpers.getResolvedFileName(
        filesConfig.templates.name,
        componentName
      )}.${filesConfig.templates.extension}`,
      mocks: `${filesConfig.mocks.name}.${filesConfig.mocks.extension}`,
      docs: `${filesConfig.docs.name}.${filesConfig.docs.extension}`,
      info: `${filesConfig.info.name}.${filesConfig.info.extension}`,
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
   *
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
