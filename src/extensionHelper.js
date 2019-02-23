function pathEndsWithExtension(path, ext) {
  const extension = `.${ext}`;
  return path.indexOf(extension) === path.length - extension.length;
}

module.exports = {
  pathEndsWithExtension
};
