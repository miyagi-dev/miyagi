const schemaFaker = require("@stoplight/json-schema-sampler");
const jsonToYaml = require("js-yaml");
const yamlToJson = require("js-yaml");
const fs = require("fs");
const log = require("../logger.js");
const { messages } = require("../config.json");

/**
 * Module for creating dummy mock data based on JSON schema
 *
 * @module generatorMocks
 * @param {string} folderPath - the path for the component that should be created
 * @param {object} filesConfig - the files configuration from the user configuration object
 */
module.exports = async function mockGenerator(folderPath, filesConfig) {
  if (!folderPath) {
    log("error", messages.dataGenerator.noComponentFolderDefined);

    return;
  }

  log(
    "info",
    messages.dataGenerator.starting.replace("{{fileName}}", folderPath)
  );

  const mockFilePath = `${folderPath}/${filesConfig.mocks.name}.${filesConfig.mocks.extension}`;
  const schemaFilePath = `${folderPath}/${filesConfig.schema.name}.${filesConfig.schema.extension}`;

  readFile(schemaFilePath)
    .then((result) => {
      try {
        const content = getContent(filesConfig.mocks.extension, result);

        readFile(mockFilePath)
          .then((res) => {
            if (res === "") {
              createFile(content, mockFilePath);
            } else {
              log(
                "error",
                messages.dataGenerator.dataFileExists.replace(
                  "{{fileName}}",
                  mockFilePath
                )
              );
            }
          })
          .catch(() => {
            createFile(content, mockFilePath);
          });
      } catch (e) {
        log(
          "error",
          messages.dataGenerator.schemaFileCantBeParsed.replace(
            "{{fileName}}",
            schemaFilePath
          )
        );
      }
    })
    .catch(() => {
      log(
        "error",
        messages.dataGenerator.noSchemaFile.replace(
          "{{fileName}}",
          schemaFilePath
        )
      );
    });

  /**
   * Returns the dummy mock data in the correct format
   *
   * @param {string} fileType - the file type of the mock data that should be created
   * @param {object} schema - the JSON schema object
   * @returns {string} the dummy mock data
   */
  function getContent(fileType, schema) {
    let content;
    const data = schemaFaker.sample(schema);

    switch (fileType) {
      case "yaml":
        content = jsonToYaml.dump(data);
        break;
      case "json":
        content = JSON.stringify(
          {
            data,
          },
          null,
          2
        );
        break;
      case "js":
        content = `module.exports = ${JSON.stringify(
          {
            data,
          },
          null,
          2
        )}
      `;
        break;
      default:
        content = "";
    }

    return content;
  }

  /**
   * Creates the mock file with the dummy mock data
   *
   * @param {string} content - the content for the mock file
   * @param {string} mockFilePath - the path to the mock file
   */
  function createFile(content, mockFilePath) {
    fs.writeFile(mockFilePath, content, (err) => {
      if (err) {
        log("error", err);
      } else {
        log("success", messages.generator.done);
      }
    });
  }

  /**
   * Reads the content of a given file
   *
   * @param {string} filePath - path to a file that should be read
   * @returns {Promise} gets resolved when the file has been read
   */
  function readFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (filesConfig.schema.extension === "yaml") {
            resolve(yamlToJson.load(result));
          } else {
            resolve(JSON.parse(result));
          }
        }
      });
    });
  }
};
