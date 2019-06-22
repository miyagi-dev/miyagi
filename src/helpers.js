function pathEndsWithExtension(file, ext) {
  const extension = `.${ext}`;

  return (
    file.indexOf(extension) > 0 &&
    file.indexOf(extension) === file.length - extension.length
  );
}

module.exports = {
  pathEndsWithExtension
};
