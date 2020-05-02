"use strict";

const path = require("path");
const chokidar = require("chokidar");
const cloneDeep = require("clone-deep");
const socketIo = require("socket.io");
const setState = require("../state");
const { readFile } = require("../state/file-contents.js");
const helpers = require("../helpers.js");
const setPartials = require("./partials.js");
const logger = require("../logger.js");
const { messages } = require("../config.json");

let triggeredEvents = [];
let timeout;
let appInstance;
let ioInstance;

function changeFileCallback(reloadParent) {
  if (appInstance.get("config").reload) {
    ioInstance.emit("fileChanged", reloadParent);
  }

  triggeredEvents = [];
  logger.log("info", messages.updatingDone);
}

function triggeredEventsIncludes(triggeredEvents, events) {
  const flattened = triggeredEvents.map((event) => event.event);

  for (let i = 0; i < flattened.length; i += 1) {
    if (events.includes(flattened[i])) {
      return true;
    }
  }

  return false;
}

async function updateFileContents(appInstance, events) {
  const data = cloneDeep(appInstance.get("state").fileContents);
  const promises = [];

  events.forEach(({ event, changedPath }) => {
    if (
      helpers.fileIsDataFile(changedPath) ||
      helpers.fileIsDocumentationFile(changedPath) ||
      helpers.fileIsSchemaFile(changedPath)
    ) {
      if (event === "add" || event === "change") {
        promises.push(
          new Promise(async (resolve) => {
            data[changedPath] = await readFile(appInstance, changedPath);
            resolve();
          })
        );
      } else if (event === "unlink") {
        delete data[changedPath];
      }
    }
  });

  return await Promise.all(promises).then(() => {
    return data;
  });
}

async function handleFileChange() {
  if (triggeredEventsIncludes(triggeredEvents, ["addDir", "unlinkDir"])) {
    await setState(appInstance, {
      sourceTree: true,
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      menu: true,
      partials: true,
    });

    changeFileCallback(true);
  } else if (
    triggeredEvents.filter((event) =>
      helpers.fileIsTemplateFile(appInstance, event.changedPath)
    ).length > 0 &&
    triggeredEventsIncludes(triggeredEvents, ["add", "unlink"])
  ) {
    await setState(appInstance, {
      sourceTree: true,
      menu: true,
      partials: true,
    });

    if (triggeredEventsIncludes(triggeredEvents, ["add"])) {
      await setPartials.registerPartial(
        appInstance,
        triggeredEvents.find((event) => event.event === "add").changedPath
      );

      changeFileCallback(true);
    } else {
      changeFileCallback(true);
    }
  } else if (helpers.fileIsDataFile(triggeredEvents[0].changedPath)) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      sourceTree: triggeredEventsIncludes(triggeredEvents, ["add", "unlink"]),
      menu: true,
    });

    changeFileCallback(
      triggeredEventsIncludes(triggeredEvents, ["add", "unlink", "change"])
    );
  } else if (helpers.fileIsDocumentationFile(triggeredEvents[0].changedPath)) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
    });

    changeFileCallback(
      triggeredEventsIncludes(triggeredEvents, ["add", "unlink", "change"])
    );
  } else if (helpers.fileIsDataFile(triggeredEvents[0].changedPath)) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      sourceTree: triggeredEventsIncludes(triggeredEvents, ["add", "unlink"]),
      menu: true,
    });

    changeFileCallback(
      triggeredEventsIncludes(triggeredEvents, ["add", "unlink", "change"])
    );
  } else {
    changeFileCallback();
  }
}

function getIgnoredPathsArr(srcFolderIgnores) {
  return [
    // ignore dotfiles
    /(^|[\/\\])\../ /* eslint-disable-line */,
    ...srcFolderIgnores.map((dir) => path.resolve(dir)),
  ];
}

module.exports = function(server, app) {
  appInstance = app;
  ioInstance = socketIo.listen(server);

  const { srcFolder, srcFolderIgnores } = appInstance.get("config");
  const ignored = getIgnoredPathsArr(srcFolderIgnores);

  chokidar
    .watch(path.resolve(srcFolder), {
      ignoreInitial: true,
      ignored,
    })
    .on("all", (event, changedPath) => {
      triggeredEvents.push({ event, changedPath });

      if (!timeout) {
        logger.log("info", messages.updatingStarted);
        timeout = setTimeout(() => {
          timeout = null;
          handleFileChange();
        }, 10);
      }
    });
};
