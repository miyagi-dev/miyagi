function sanitizeSrcFolder(srcFolder) {
  let folder = srcFolder;

  while (folder.indexOf("../") === 0) {
    folder = folder.slice(3);
  }

  if (folder.indexOf("/") === 0) {
    folder = folder.slice(1);
  }

  return folder;
}

function sanitizeAssetFiles(files) {
  const arr = [];

  files.forEach(file => {
    while (file.indexOf("../") === 0) {
      file = file.slice(3);
    }

    if (file.indexOf("/") === 0) {
      file = file.slice(1);
    }

    arr.push(file);
  });

  return arr;
}

module.exports = (app, config) => {
  config.srcFolder = sanitizeSrcFolder(config.srcFolder);
  config.cssFiles = sanitizeAssetFiles(config.cssFiles);
  config.jsFiles = sanitizeAssetFiles(config.jsFiles);

  app.set(
    "config",
    Object.assign(
      {},
      {
        cssFiles: []
      },
      config
    )
  );
};
