/**
 * Helper functions for all state modules
 *
 * @module state/helpers
 */

const path = require("path");
const { readdir } = require("fs").promises;

/**
 * @param {object} dir - the directory in which to look for files
 * @param {string[]} ignores - an array of folders which should be ignored
 * @param {Function} check - checks if the file should be returned, returns null or the file path
 * @returns {string[]} an array with file paths
 */
async function getFiles(dir, ignores, check) {
  const entries = await readdir(path.join(process.cwd(), dir), {
    withFileTypes: true,
  });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);
      if (isNotIgnored(res, ignores)) {
        if (entry.isDirectory()) {
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
}

/**
 * Checks if a given file is not in one of the ignored folders
 *
 * @param {string} file
 * @param {Array} ignoredFolders
 * @returns {boolean}
 */
function isNotIgnored(file, ignoredFolders) {
  for (let i = 0; i < ignoredFolders.length; i += 1) {
    if (file.indexOf(ignoredFolders[i]) === 0) {
      return false;
    }
  }

  return true;
}

module.exports = {
  getFiles,
  isNotIgnored,
};
