const path = require("path");
const config = require("./config.json");
const assetFolder =
  process.env.NODE_ENV === "production"
    ? config.folders.dist
    : config.folders.assets;

function registerUserFiles(app, express, files) {
  files.forEach(file => {
    app.use(
      `/${path.dirname(file)}`,
      express.static(path.join(process.cwd(), path.dirname(file)))
    );
  });
}

module.exports = (app, express) => {
  registerUserFiles(app, express, app.get("config").cssFiles);
  registerUserFiles(app, express, app.get("config").jsFiles);

  app.use(express.static(path.join(__dirname, `../${assetFolder}/js`)));
  app.use(express.static(path.join(__dirname, `../${assetFolder}/css`)));
  app.use(
    express.static(
      path.join(process.cwd(), "node_modules/socket.io-client/dist")
    )
  );
  app.use(express.static(path.join(process.cwd(), "node_modules/axe-core")));
};
