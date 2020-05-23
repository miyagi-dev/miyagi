const jsf = require("json-schema-faker");
const jsonToYaml = require("json-to-pretty-yaml");
const path = require("path");
const fs = require("fs");
const logger = require("../logger.js");
const { messages } = require("../config.json");

function getContent(config, dataFilePath, schema) {
  let content = "";
  const data = jsf.generate(schema);

  switch (config.files.mocks.extension) {
    case "yaml":
      content = jsonToYaml.stringify(data);
      break;
    case "json":
      content = JSON.stringify(
        {
          data,
        },
        0,
        2
      );
      break;
    case "js":
      content = `module.exports = ${JSON.stringify(
        {
          data,
        },
        0,
        2
      )}
      `;
      break;
  }

  return content;
}

function createFile(config, dataFilePath, schema) {
  fs.writeFile(
    dataFilePath,
    getContent(config, dataFilePath, schema),
    (err, result) => {
      if (err) {
        logger.log("error", err);
      } else {
        logger.log("info", messages.generator.done);
      }
    }
  );
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = async function generator([folderPath], config) {
  if (!folderPath) {
    return logger.log("error", messages.dataGenerator.noComponentFolderDefined);
  }

  logger.log(
    "info",
    messages.dataGenerator.starting.replace("${fileName}", folderPath)
  );

  const folderName = folderPath.split(path.sep).slice(-1);
  const dataFilePath = `${folderPath}/${config.files.mocks.name}.${config.files.mocks.extension}`;
  const schemaFilePath = `${folderPath}/${config.files.schema.name}.${config.files.schema.extension}`;

  readFile(schemaFilePath)
    .then((result) => {
      try {
        const schema = JSON.parse(result);

        readFile(dataFilePath)
          .then((result) => {
            if (result === "") {
              createFile(config, dataFilePath, schema);
            } else {
              logger.log(
                "error",
                messages.dataGenerator.dataFileExists.replace(
                  "${fileName}",
                  dataFilePath
                )
              );
            }
          })
          .catch(() => {
            createFile(config, dataFilePath, schema);
          });
      } catch (e) {
        logger.log(
          "error",
          messages.dataGenerator.schemaFileCantBeParsed.replace(
            "${fileName}",
            schemaFilePath
          )
        );
      }
    })
    .catch(() => {
      logger.log(
        "error",
        messages.dataGenerator.noSchemaFile.replace(
          "${fileName}",
          schemaFilePath
        )
      );
    });
};