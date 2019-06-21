function pathEndsWithExtension(file, ext) {
  const extension = `.${ext}`;
  return file.indexOf(extension) === file.length - extension.length;
}

module.exports = {
  pathEndsWithExtension
};
