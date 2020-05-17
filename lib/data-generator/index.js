const jsf = require("json-schema-faker");
const path = require("path");
const fs = require("fs");
const logger = require("../logger.js");
const { messages } = require("../config.json");

function createFile(dataFilePath, schema) {
  fs.writeFile(
    dataFilePath,
    JSON.stringify(
      {
        data: jsf.generate(schema),
      },
      0,
      2
    ),
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

module.exports = async function generator(app, [folderPath], config) {
  if (!folderPath) {
    return logger.log("error", messages.dataGenerator.noComponentFolderDefined);
  }

  logger.log(
    "info",
    messages.dataGenerator.starting.replace("${fileName}", folderPath)
  );

  const folderName = folderPath.split(path.sep).slice(-1);
  const dataFilePath = `${folderPath}/${folderName}.${
    app.get("config").files.mocks.extension
  }`;
  const schemaFilePath = `${folderPath}/${
    app.get("config").files.schema.name
  }.${app.get("config").files.schema.extension}`;

  readFile(schemaFilePath)
    .then((result) => {
      try {
        const schema = JSON.parse(result);

        readFile(dataFilePath)
          .then((result) => {
            if (result === "") {
              createFile(dataFilePath, schema);
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
            createFile(dataFilePath, schema);
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
