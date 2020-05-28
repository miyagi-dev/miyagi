const jsf = require("json-schema-faker");
const jsonToYaml = require("json-to-pretty-yaml");
const fs = require("fs");
const log = require("../logger.js");
const { messages } = require("../config.json");

function getContent(config, dataFilePath, schema) {
  let content;
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
    default:
      content = "";
  }

  return content;
}

function createFile(config, dataFilePath, schema) {
  fs.writeFile(
    dataFilePath,
    getContent(config, dataFilePath, schema),
    (err) => {
      if (err) {
        log("error", err);
      } else {
        log("success", messages.generator.done);
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
    log("error", messages.dataGenerator.noComponentFolderDefined);

    return;
  }

  log(
    "info",
    messages.dataGenerator.starting.replace("{{fileName}}", folderPath)
  );

  const dataFilePath = `${folderPath}/${config.files.mocks.name}.${config.files.mocks.extension}`;
  const schemaFilePath = `${folderPath}/${config.files.schema.name}.${config.files.schema.extension}`;

  readFile(schemaFilePath)
    .then((result) => {
      try {
        const schema = JSON.parse(result);

        readFile(dataFilePath)
          .then((res) => {
            if (res === "") {
              createFile(config, dataFilePath, schema);
            } else {
              log(
                "error",
                messages.dataGenerator.dataFileExists.replace(
                  "{{fileName}}",
                  dataFilePath
                )
              );
            }
          })
          .catch(() => {
            createFile(config, dataFilePath, schema);
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
};
