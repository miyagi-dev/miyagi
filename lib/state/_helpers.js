const path = require("path");

function isNotIgnored(file, ignoredFolders) {
  for (let i = 0; i < ignoredFolders.length; i += 1) {
    if (
      path
        .join(process.cwd(), file)
        .indexOf(path.join(process.cwd(), ignoredFolders[i])) === 0
    ) {
      return false;
    }
  }

  return true;
}

module.exports = {
  isNotIgnored,
};
