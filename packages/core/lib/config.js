const path = require("path");
const deepMerge = require("deepmerge");

const { messages } = require("./config.json");
const getMergedConfig = require("./init/config.js");
const log = require("./logger.js");

module.exports = function getConfig(args, isBuild, isComponentGenerator) {
  let userFile = {};

  try {
    userFile = require(path.resolve(process.cwd(), ".miyagi"));
  } catch (err) {
    log("error", err);
    log("warn", messages.userConfigUnparseable);
  }

  let userConfig = args ? deepMerge(userFile, getCliArgs(args)) : userFile;

  userConfig.isBuild = isBuild;
  userConfig.isComponentGenerator = isComponentGenerator;

  delete userConfig._;

  return getMergedConfig(userConfig);
};

/**
 * Converts and removes unnecessary cli args
 *
 * @param {object} args - the cli args
 * @returns {object} configuration object based on cli args
 */
function getCliArgs(args) {
  const cliArgs = { ...args };
  const buildArgs = {};

  delete cliArgs._;
  delete cliArgs.$0;

  if (cliArgs.folder) {
    buildArgs.folder = cliArgs.folder;
    delete cliArgs.folder;
  }

  if (cliArgs.outputFile) {
    buildArgs.outputFile = cliArgs.outputFile;
    delete cliArgs.outputFile;
  }

  if (cliArgs.basePath) {
    buildArgs.basePath = cliArgs.basePath;
    delete cliArgs.basePath;
  }

  cliArgs.build = buildArgs;

  if (cliArgs.assets) {
    if (cliArgs.assets.es6Modules) {
      cliArgs.assets.es6Modules = cliArgs.assets.es6Modules !== "false";
    }
  }

  return cliArgs;
}
