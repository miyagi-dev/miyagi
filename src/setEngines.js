const engines = require("consolidate");

module.exports = app => {
  app.engine("hbs", engines.handlebars);
  app.set("view engine", "hbs");

  app.engine(app.get("config").extension, engines[app.get("config").engine]);
  app.set("view engine", app.get("config").extension);
};
