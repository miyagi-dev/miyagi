const path = require("path");
const config = require("./config.json");

function pathEndsWithExtension(file, ext) {
  const extension = `.${ext}`;

  return (
    file.indexOf(extension) > 0 &&
    file.indexOf(extension) === file.length - extension.length
  );
}

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

function fileIsOfGivenType(file, extension) {
  if (typeof file !== "string") return false;

  return (
    file.lastIndexOf(`.${extension}`) > 0 &&
    file.lastIndexOf(`.${extension}`) === file.length - (extension.length + 1)
  );
}

function fileIsDataFile(file) {
  return fileIsOfGivenType(file, config.dataFileType);
}

function fileIsTemplateFile(app, file) {
  return fileIsOfGivenType(file, app.get("config").extension);
}

module.exports = {
  fileIsDataFile,
  fileIsTemplateFile,
  isNotIgnored,
  pathEndsWithExtension
};
