const config = require("./config.json");

function pathEndsWithExtension(file, ext) {
  const extension = `.${ext}`;

  return (
    file.indexOf(extension) > 0 &&
    file.indexOf(extension) === file.length - extension.length
  );
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
  pathEndsWithExtension
};
