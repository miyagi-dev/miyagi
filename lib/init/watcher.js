"use strict";

const path = require("path");
const chokidar = require("chokidar");
const cloneDeep = require("clone-deep");
const setState = require("../state/index.js");
const { readFile } = require("../state/data.js");
const helpers = require("../helpers.js");
const setPartials = require("./partials.js");
const logger = require("../logger.js");
const config = require("../config.json");

let triggeredEvents = [];
let timeout;

function changeFileCallback(io, reloadParent) {
  io.emit("fileChanged", reloadParent);
  triggeredEvents = [];
  logger.log("info", config.messages.updatingDone);
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

async function updateData(app, events) {
  const data = cloneDeep(app.get("state").data);
  const promises = [];

  events.forEach(event => {
    if (helpers.fileIsDataFile(event.changedPath)) {
      if (event.event === "add" || event.event === "change") {
        promises.push(
          new Promise(async resolve => {
            data[event.changedPath] = await readFile(event.changedPath);
            resolve();
          })
        );
      } else if (event.event === "unlink") {
        delete data[event.changedPath];
      }
    }
  });

  return await Promise.all(promises).then(() => {
    return data;
  });
}

async function handleFileChange(app, hbs, io) {
  if (triggeredEventsIncludes(triggeredEvents, ["addDir", "unlinkDir"])) {
    await setState(app, {
      sourceTree: true,
      data: await updateData(app, triggeredEvents),
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
    await setState(app, {
      data: await updateData(app, triggeredEvents),
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
        logger.log("info", config.messages.updatingStarted);
        timeout = setTimeout(() => {
          timeout = null;
          handleFileChange(app, hbs, io);
        }, 10);
      }
    });
};
