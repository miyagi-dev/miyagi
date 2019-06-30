const path = require("path");
const chokidar = require("chokidar");
const config = require("./config.json");
const setState = require("./setState.js");
const registerPartials = require("./hbs/registerPartials.js");

function onFilesChanged(io, app, hbs, event, path) {
  let reloadParent = false;

  if (event === "addDir" || event === "unlinkDir") {
    reloadParent = true;
  } else if (
    path.lastIndexOf(`.${config.dataFileType}`) ===
      path.length - `.${config.dataFileType}`.length &&
    (event === "add" || event === "unlink" || event === "change")
  ) {
    reloadParent = true;
  } else if (
    (path.lastIndexOf(`.${app.get("config").extension}`) ===
      path.length - `.${app.get("config").extension}` &&
      event === "add") ||
    event == "unlink"
  ) {
    reloadParent = true;
  }

  io.emit("fileChanged", reloadParent);

  setState(app, () => {
    registerPartials(app, hbs);
  });
}

function fileWatcher(server, app, hbs) {
  const io = require("socket.io").listen(server);
  const ignored = [];
  const watch = [];

  app.get("config").watch.forEach(extension => {
    watch.push(
      `${process.cwd()}/${app.get("config").srcFolder}**/*.${extension}`
    );
  });

  app.get("config").srcFolderIgnores.forEach(dir => {
    ignored.push(path.join(process.cwd(), dir));
  });

  chokidar
    .watch(watch, {
      ignoreInitial: true,
      ignored
    })
    .on("all", (event, path) => {
      onFilesChanged(io, app, hbs, event, path);
    });
}

module.exports = fileWatcher;
