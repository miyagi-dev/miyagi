import path from "path";
import fs from "fs";
import jsonToYaml from "js-yaml";
import log from "../logger.js";
import { getResolvedFileName } from "../helpers.js";
import { messages } from "../miyagi-config.js";

/**
 * Module for creating component files based on the configuration cli params
 *
 * @module generatorComponent
 * @param {object} cliParams - the cli params object
 * @param {object} config - the user configuration object
 */
export default async function componentGenerator(cliParams, config) {
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
   * @returns {Array} all file paths that should be created
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
   * @param {string} fileType - the file type that should be created
   * @param {object} filesConfig - the files object from the user congiguration object
   * @returns {string} dummy file content based on the given file type
   */
  function getDummyFileContent(fileType, filesConfig) {
    let str;

    switch (fileType) {
      case "mocks":
        {
          const data = {
            $variants: [
              {
                $name: "",
              },
            ],
          };

          if (filesConfig.mocks.extension === "yaml") {
            str = jsonToYaml.dump(data);
          } else {
            str = `${JSON.stringify(data, null, 2)}\n`;
          }
        }
        break;
      case "info":
        {
          const data = {
            name: "",
          };

          if (filesConfig.info.extension === "yaml") {
            str = jsonToYaml.dump(data);
          } else {
            str = `${JSON.stringify(data, null, 2)}\n`;
          }
        }
        break;
      case "schema":
        {
          const data = {
            $schema: "http://json-schema.org/draft-07/schema",
            $id: "",
            required: [],
            properties: {},
          };

          if (filesConfig.schema.extension === "yaml") {
            str = jsonToYaml.dump(data);
          } else {
            str = `${JSON.stringify(data, null, 2)}\n`;
          }
        }
        break;
      default:
        str = "";
    }

    return str;
  }

  /**
   * Creates the component files
   *
   * @param {object} filesConfig - the files configuration from the user configuration object
   * @param {string} componentPath - the path of the component folder
   * @param {object} args - the cli args
   * @returns {Promise} gets resolved when all files have been created
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
            const fullFilePath = path.join(
              process.env.INIT_CWD,
              componentPath,
              file
            );

            fs.writeFile(
              fullFilePath,
              getDummyFileContent(type, filesConfig),
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
   * @param {object} filesConfig - the files configuration from the user configuration object
   * @param {string} componentName - the name of the component
   * @returns {object} all file names based on the user configuration
   */
  function getFileNames(filesConfig, componentName) {
    return {
      tpl: `${getResolvedFileName(filesConfig.templates.name, componentName)}.${
        filesConfig.templates.extension
      }`,
      mocks: `${filesConfig.mocks.name}.${filesConfig.mocks.extension}`,
      docs: `${filesConfig.docs.name}.${filesConfig.docs.extension}`,
      info: `${filesConfig.info.name}.${filesConfig.info.extension}`,
      css: `${getResolvedFileName(filesConfig.css.name, componentName)}.${
        filesConfig.css.extension
      }`,
      js: `${getResolvedFileName(filesConfig.js.name, componentName)}.${
        filesConfig.js.extension
      }`,
      schema: `${filesConfig.schema.name}.${filesConfig.schema.extension}`,
    };
  }

  /**
   * Creates the component folder
   *
   * @param {string} folder - component folder path that should be created
   * @returns {Promise} gets resolved when the folder has been created
   */
  function createComponentFolder(folder) {
    return new Promise((resolve, reject) => {
      fs.mkdir(
        path.join(process.env.INIT_CWD, folder),
        { recursive: true },
        function createComponentCallback(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
