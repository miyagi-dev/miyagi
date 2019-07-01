const path = require("path");
const chokidar = require("chokidar");
const setState = require("./setState.js");
const { storeFileContentInCache } = require("./state/data.js");
const helpers = require("./helpers.js");
const registerPartials = require("./hbs/registerPartials.js");

function changeFileCallback(io, reloadParent) {
  io.emit("fileChanged", reloadParent);
}

function onDataFileChanged(io, app, event, changedPath) {
  storeFileContentInCache(app, changedPath, () => {
    setState(app, { menu: true, data: true }, () => {
      changeFileCallback(
        io,
        event === "add" || event === "unlink" || event === "change"
      );
    });
  });
}

function onTemplateFileChanged(io, app, hbs, event, changedPath) {
  if (event === "add" || event === "unlink") {
    setState(app, { menu: true, partials: true, data: true }, () => {
      registerPartials.registerPartial(app, hbs, changedPath).then(() => {
        changeFileCallback(io, true);
      });
    });
  } else {
    changeFileCallback(io);
  }
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
    .on("all", (event, changedPath) => {
      if (helpers.fileIsDataFile(changedPath)) {
        onDataFileChanged(io, app, event, changedPath);
      } else if (helpers.fileIsTemplateFile(app, changedPath)) {
        onTemplateFileChanged(io, app, hbs, event, changedPath);
      } else {
        setState(app, { menu: true, data: true }, () => {
          changeFileCallback(
            io,
            app,
            event === "addDir" || event === "unlinkDir"
          );
        });
      }
    });
}

module.exports = fileWatcher;
