const path = require("path");

function pathEndsWithExtension(file, ext) {
  const extension = `.${ext}`;
  return file.indexOf(extension) === file.length - extension.length;
}

function fileIsInFolderWithSameName(file, ext) {
  const isValid = path.dirname(file).endsWith(path.basename(file, `.${ext}`));

  if (!isValid) {
    console.warn(
      `WARNING: ${file} has not been rendered because it doesn't live in a folder with the same name.`
    );
  }

  return isValid;
}

module.exports = {
  pathEndsWithExtension,
  fileIsInFolderWithSameName
};
