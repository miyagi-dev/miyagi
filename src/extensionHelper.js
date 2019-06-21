const config = require("./config.json");
const path = require("path");

function pathEndsWithExtension(file, ext) {
  const extension = `.${ext}`;
  return file.indexOf(extension) === file.length - extension.length;
}

function fileIsInFolderWithSameName(file, ext) {
  const isValid = path.dirname(file).endsWith(path.basename(file, `.${ext}`));

  if (!isValid) {
    console.warn(
      config.messages.fileNotRenderedDueToUnmatchingFolderName.replace(
        "${file}",
        file
      )
    );
  }

  return isValid;
}

module.exports = {
  pathEndsWithExtension,
  fileIsInFolderWithSameName
};
