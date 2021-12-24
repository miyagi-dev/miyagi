import path from "path";
import deepMerge from "deepmerge";

import { messages } from "./miyagi-config.js";
import getMergedConfig from "./init/config.js";
import log from "./logger.js";

export default async function getConfig(args, isBuild, isComponentGenerator) {
  let userFile = {};
  let userFileName = ".miyagi.js";

  try {
    userFile = await import(path.resolve(process.cwd(), userFileName));
  } catch (e) {
    try {
      userFileName = ".miyagi.json";
      userFile = await import(path.resolve(process.cwd(), userFileName));
    } catch (err) {
      userFileName = null;
      log("warn", messages.userConfigUnparseable);
    }
  }

  let userConfig = args
    ? deepMerge(userFile.default, getCliArgs(args))
    : userFile.default;

  userConfig.userFileName = userFileName;
  userConfig.isBuild = isBuild;
  userConfig.isComponentGenerator = isComponentGenerator;

  delete userConfig._;

  return getMergedConfig(userConfig);
}

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

  return cliArgs;
}
