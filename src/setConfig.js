function sanitizePath(path, isFolder) {
  while (path.indexOf("../") === 0) {
    path = path.slice(3);
  }

  if (path.indexOf("/") === 0) {
    path = path.slice(1);
  }

  if (isFolder && path.slice(-1) !== "/") {
    path += "/";
  }

  return path;
}

function sanitizeAssetFiles(files) {
  const arr = [];

  files.forEach(file => {
    arr.push(sanitizePath(file));
  });

  return arr;
}

module.exports = (app, config) => {
  config.srcFolder = sanitizePath(config.srcFolder, true);

  if (config.cssFiles) {
    config.cssFiles = sanitizeAssetFiles(config.cssFiles);
  }

  if (config.jsFiles) {
    config.jsFiles = sanitizeAssetFiles(config.jsFiles);
  }

  app.set(
    "config",
    Object.assign(
      {
        includeComponentCss: true,
        includeComponentJs: true,
        cssFiles: [],
        jsFiles: [],
        validations: {
          html: true,
          accessibility: true
        }
      },
      config
    )
  );
};
