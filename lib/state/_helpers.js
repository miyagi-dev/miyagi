const path = require("path");
const { readdir } = require("fs").promises;

async function getFiles(app, dir, check) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);
      if (isNotIgnored(res, app.get("config").components.ignores)) {
        if (entry.isDirectory()) {
          return await getFiles(app, res, check);
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
