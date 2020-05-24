const path = require("path");
const fs = require("fs");
const logger = require("../logger.js");
const { messages } = require("../config.json");

function getFullComponentPath(componentName, config) {
  return path.join(config.components.folder, componentName);
}

function getFiles(fileNames, opts) {
  if (opts) {
    if (opts.skip) {
      const files = [];
      const targets = opts.skip.split(",");
      const entries = Object.entries(fileNames);
      for (const [alias, name] of entries) {
        if (!targets.includes(alias)) {
          files.push(name);
        }
      }
      return files;
    } else if (opts.only) {
      return opts.only.split(",").map((entry) => fileNames[entry]);
    } else {
      return Object.values(fileNames);
    }
  } else {
    return Object.values(fileNames);
  }
}

function getDummyFileContent(fileType) {
  let str = "";

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
  }

  return str;
}

function createComponentFiles(componentPath, fileNames, opts) {
  const promises = [];
  const files = getFiles(fileNames, opts);

  const entries = Object.entries(fileNames);
  for (const [type, file] of entries) {
    if (files.includes(file)) {
      promises.push(
        new Promise((resolve) => {
          const fullFilePath = path.join(componentPath, file);

          fs.writeFile(
            fullFilePath,
            getDummyFileContent(type),
            { flag: "wx" },
            function createComponentFilesCallback(err, result) {
              if (err) {
                if (err.code == "EEXIST") {
                  logger.log(
                    "warn",
                    messages.generator.fileAlreadyExists.replace(
                      "${name}",
                      fullFilePath
                    )
                  );
                } else if (err.code != "ENOENT") {
                  logger.log(
                    "error",
                    messages.generator.unknownError.replace(
                      "${name}",
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

function createComponentFolder(componentPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(
      componentPath,
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

module.exports = async function generator(params, config) {
  const commands = params._.slice(1);

  if (commands.length === 0) {
    return logger.log("error", messages.generator.noComponentNameDefined);
  }

  const [componentNameWithFolder] = commands;
  const componentName = componentNameWithFolder.split(path.sep).slice(-1);
  const fileNames = {
    tpl: `${config.files.templates.name}.${config.files.templates.extension}`,
    mocks: `${config.files.mocks.name}.${config.files.mocks.extension}`,
    docs: `${config.files.docs.name}.${config.files.docs.extension}`,
    css: `${config.files.css.name}.${config.files.css.extension}`,
    js: `${config.files.js.name}.${config.files.js.extension}`,
    schema: `${config.files.schema.name}.${config.files.schema.extension}`,
  };
  const componentPath = getFullComponentPath(componentNameWithFolder, config);

  createComponentFolder(componentPath)
    .then(async () => {
      await createComponentFiles(componentPath, fileNames, params);
      logger.log("info", messages.generator.done);
    })
    .catch(() => {
      logger.log(
        "error",
        messages.generator.unknownError.replace("${name}", componentPath)
      );
    });
};
