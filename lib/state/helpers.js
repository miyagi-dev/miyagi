/**
 * Helper functions for all state modules
 * @module state/helpers
 */

const path = require("path");
const { readdir } = require("fs").promises;

async function getFiles(app, dir, check) {
  const entries = await readdir(path.join(process.cwd(), dir), {
    withFileTypes: true,
  });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);
      if (isNotIgnored(res, app.get("config").components.ignores)) {
        if (entry.isDirectory()) {
          return await getFiles(app, path.join(dir, entry.name), check);
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
 * @param {string} file
 * @param {array} ignoredFolders
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
