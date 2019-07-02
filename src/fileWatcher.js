const path = require("path");
const chokidar = require("chokidar");
const setState = require("./setState.js");
const { storeFileContentInCache } = require("./state/data.js");
const helpers = require("./helpers.js");
const registerPartials = require("./hbs/registerPartials.js");

let triggeredEvents = [];
let triggered = false;

function changeFileCallback(io, reloadParent) {
  io.emit("fileChanged", reloadParent);
  triggeredEvents = [];
}

function fileWatcher(server, app, hbs) {
  const io = require("socket.io").listen(server);
  const ignored = [];

  // ignore dotfiles
  ignored.push(/(^|[\/\\])\../); /* eslint-disable-line */

  app.get("config").srcFolderIgnores.forEach(dir => {
    ignored.push(path.join(process.cwd(), dir));
  });

  chokidar
    .watch(`${process.cwd()}/${app.get("config").srcFolder}`, {
      ignoreInitial: true,
      ignored
    })
    .on("all", (event, changedPath) => {
      triggeredEvents.push(event);

      if (!triggered) {
        triggered = true;
        setTimeout(() => {
          triggered = false;

          if (
            triggeredEvents.includes("addDir") ||
            triggeredEvents.includes("unlinkDir")
          ) {
            setState(
              app,
              { sourceTree: true, menu: true, data: true, partials: true },
              () => {
                changeFileCallback(io, true);
              }
            );
          } else if (
            helpers.fileIsTemplateFile(app, changedPath) &&
            (triggeredEvents.includes("add") ||
              triggeredEvents.includes("unlink"))
          ) {
            setState(
              app,
              { sourceTree: true, menu: true, data: true, partials: true },
              () => {
                registerPartials
                  .registerPartial(app, hbs, changedPath)
                  .then(() => {
                    changeFileCallback(io, true);
                  });
              }
            );
          } else if (helpers.fileIsDataFile(changedPath)) {
            storeFileContentInCache(app, changedPath, () => {
              setState(
                app,
                {
                  sourceTree:
                    triggeredEvents.includes("add") ||
                    triggeredEvents.includes("unlink"),
                  menu: true
                },
                () => {
                  changeFileCallback(
                    io,
                    triggeredEvents.includes("add") ||
                      triggeredEvents.includes("unlink") ||
                      triggeredEvents.includes("change")
                  );
                }
              );
            });
          } else {
            changeFileCallback(io);
          }
        }, 100);
      }
    });
}

module.exports = fileWatcher;
