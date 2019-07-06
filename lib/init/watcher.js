"use strict";

const path = require("path");
const chokidar = require("chokidar");
const setState = require("../state/index.js");
const {
  storeFileContentInCache,
  removeFileFromCache
} = require("../state/data.js");
const helpers = require("../helpers.js");
const setPartials = require("./partials.js");

let triggeredEvents = [];
let timeout;

function changeFileCallback(io, reloadParent) {
  io.emit("fileChanged", reloadParent);
  triggeredEvents = [];
}

function triggeredEventsIncludes(triggeredEvents, events) {
  const flattened = triggeredEvents.map(event => event.event);

  for (let i = 0; i < flattened.length; i += 1) {
    if (events.includes(flattened[i])) {
      return true;
    }
  }

  return false;
}
async function handleFileChange(app, hbs, io) {
  if (triggeredEventsIncludes(triggeredEvents, ["addDir", "unlinkDir"])) {
    await triggeredEvents.forEach(async event => {
      if (helpers.fileIsDataFile(event.changedPath)) {
        if (event.event === "add") {
          await storeFileContentInCache(app, event.changedPath);
        } else if (event.event === "unlink") {
          removeFileFromCache(app, event.changedPath);
        }
      }
    });

    await setState(app, {
      sourceTree: true,
      menu: true,
      partials: true
    });

    changeFileCallback(io, true);
  } else if (
    triggeredEvents.filter(event =>
      helpers.fileIsTemplateFile(app, event.changedPath)
    ).length > 0 &&
    triggeredEventsIncludes(triggeredEvents, ["add", "unlink"])
  ) {
    await setState(app, {
      sourceTree: true,
      menu: true,
      partials: true
    });

    if (triggeredEventsIncludes(triggeredEvents, ["add"])) {
      await setPartials.registerPartial(
        app,
        hbs,
        triggeredEvents.filter(event => event.event === "add")[0].changedPath
      );

      changeFileCallback(io, true);
    } else {
      changeFileCallback(io, true);
    }
  } else if (helpers.fileIsDataFile(triggeredEvents[0].changedPath)) {
    await triggeredEvents.forEach(async event => {
      if (event.event === "add" || event.event === "change") {
        await storeFileContentInCache(app, event.changedPath);
      } else if (event.event === "unlink") {
        removeFileFromCache(app, event.changedPath);
      }
    });

    await setState(app, {
      sourceTree: triggeredEventsIncludes(triggeredEvents, ["add", "unlink"]),
      menu: true
    });

    changeFileCallback(
      io,
      triggeredEventsIncludes(triggeredEvents, ["add", "unlink", "change"])
    );
  } else {
    changeFileCallback(io);
  }
}

module.exports = function(server, app, hbs) {
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
      triggeredEvents.push({ event, changedPath });

      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          handleFileChange(app, hbs, io);
        }, 100);
      }
    });
};
