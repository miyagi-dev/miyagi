/**
 * Helper functions for all state modules
 *
 * @module stateHelpers
 */

import path from "path";
import log from "../logger.js";
import { messages } from "../miyagi-config.js";
import { readdir } from "fs/promises";

/**
 * @param {object} dir - the directory in which to look for files
 * @param {string[]} ignores - an array of folders which should be ignored
 * @param {Function} check - checks if the file should be returned, returns null or the file path
 * @returns {Promise<string[]>} an array with file paths
 */
export const getFiles = async function (dir, ignores, check) {
  try {
    var entries = await readdir(path.join(process.cwd(), dir), {
      withFileTypes: true,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      log("error", messages.srcFolderNotFound.replace("{{directory}}", dir));
    } else {
      log("error", error.toString());
    }
    return check(dir);
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);

      if (isNotIgnored(res, ignores)) {
        if (entry.isDirectory() || entry.isSymbolicLink()) {
          return await getFiles(path.join(dir, entry.name), ignores, check);
        } else {
          return check(res);
        }
      } else {
        return null;
      }
    })
  );

  return Array.prototype.concat(...files).filter((file) => file !== null);
};

/**
 * Checks if a given file is not in one of the ignored folders
 *
 * @param {string} file - file path
 * @param {Array} ignoredFolders - folders that should be ignored
 * @returns {boolean} returns true if the given file is not inside any of the given ignoredFolders
 */
export const isNotIgnored = function (file, ignoredFolders) {
  for (let i = 0; i < ignoredFolders.length; i += 1) {
    if (file.includes(ignoredFolders[i])) {
      return false;
    }
  }

  return true;
};
