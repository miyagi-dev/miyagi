const path = require("path");
const config = require("./config.json");

module.exports = app => {
  app.set("views", [
    path.join(__dirname, `../${config.folders.views}`),
    path.join(process.cwd(), app.get("config").srcFolder)
  ]);
};
