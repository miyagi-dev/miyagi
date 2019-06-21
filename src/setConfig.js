function sanitizePath(path) {
  while (path.indexOf("../") === 0) {
    path = path.slice(3);
  }

  if (path.indexOf("/") === 0) {
    path = path.slice(1);
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
  config.srcFolder = sanitizePath(config.srcFolder);

  if (config.cssFiles) {
    config.cssFiles = sanitizeAssetFiles(config.cssFiles);
  }

  if (config.jsFiles) {
    config.jsFiles = sanitizeAssetFiles(config.jsFiles);
  }

  app.set(
    "config",
    Object.assign(
      {},
      {
        cssFiles: [],
        jsFiles: []
      },
      config
    )
  );
};
