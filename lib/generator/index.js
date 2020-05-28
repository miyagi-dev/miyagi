const path = require("path");
const fs = require("fs");
const log = require("../logger.js");
const helpers = require("../helpers.js");
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
    }
    if (opts.only) {
      return opts.only.split(",").map((entry) => fileNames[entry]);
    }
    return Object.values(fileNames);
  }
  return Object.values(fileNames);
}

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

function createComponentFiles(config, componentPath, opts) {
  const componentName = path.basename(componentPath);
  const promises = [];
  const fileNames = {
    tpl: `${helpers.getResolvedFileName(
      config.files.templates.name,
      componentName
    )}.${config.files.templates.extension}`,
    mocks: `${config.files.mocks.name}.${config.files.mocks.extension}`,
    docs: `${config.files.docs.name}.${config.files.docs.extension}`,
    css: `${helpers.getResolvedFileName(
      config.files.css.name,
      componentName
    )}.${config.files.css.extension}`,
    js: `${helpers.getResolvedFileName(config.files.js.name, componentName)}.${
      config.files.js.extension
    }`,
    schema: `${config.files.schema.name}.${config.files.schema.extension}`,
  };
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
    log("error", messages.generator.noComponentNameDefined);

    return;
  }

  const [componentNameWithFolder] = commands;
  const componentPath = getFullComponentPath(componentNameWithFolder, config);

  createComponentFolder(componentPath)
    .then(async () => {
      await createComponentFiles(config, componentPath, params);
      log("success", messages.generator.done);
    })
    .catch(() => {
      log(
        "error",
        messages.generator.unknownError.replace("{{name}}", componentPath)
      );
    });
};
