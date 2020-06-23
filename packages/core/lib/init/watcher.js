/**
 * Module for watching user file changes
 *
 * @module init/watcher
 */

const path = require("path");
const chokidar = require("chokidar");
const socketIo = require("socket.io");
const setState = require("../state");
const { readFile } = require("../state/file-contents.js");
const helpers = require("../helpers.js");
const setPartials = require("./partials.js");
const log = require("../logger.js");
const { messages } = require("../config.json");

let triggeredEvents = [];
let timeout;
let appInstance;
let ioInstance;

/**
 * @param reload
 * @param reloadParent
 */
function changeFileCallback(reload, reloadParent) {
  if (reload && appInstance.get("config").ui.reload) {
    ioInstance.emit("fileChanged", reloadParent);
  }

  triggeredEvents = [];
  log("success", `${messages.updatingDone}\n`);
}

/**
 * @param triggered
 * @param events
 */
function triggeredEventsIncludes(triggered, events) {
  const flattened = triggered.map((event) => event.event);

  for (let i = 0; i < flattened.length; i += 1) {
    if (events.includes(flattened[i])) {
      return true;
    }
  }

  return false;
}

/**
 * @param {object} app - the express instance
 * @param events
 */
async function updateFileContents(app, events) {
  const data = helpers.cloneDeep(app.get("state").fileContents);
  const promises = [];

  for (const { event, changedPath } of events) {
    if (
      helpers.fileIsDataFile(app, changedPath) ||
      helpers.fileIsDocumentationFile(app, changedPath) ||
      helpers.fileIsInfoFile(app, changedPath) ||
      helpers.fileIsSchemaFile(app, changedPath)
    ) {
      const fullPath = path.join(process.cwd(), changedPath);

      if (event === "add" || event === "change") {
        promises.push(
          new Promise((resolve) => {
            readFile(app, changedPath).then((result) => {
              data[fullPath] = result;
              resolve();
            });
          })
        );
      } else if (event === "unlink") {
        promises.push(
          new Promise((resolve) => {
            delete data[fullPath];
            resolve();
          })
        );
      }
    }
  }

  return Promise.all(promises).then(() => {
    return data;
  });
}

/**
 *
 */
async function handleFileChange() {
  if (
    triggeredEvents.find(({ changedPath }) => {
      return (
        appInstance.get("config").assets.css.includes(changedPath) ||
        appInstance.get("config").assets.js.includes(changedPath)
      );
    })
  ) {
    changeFileCallback(true, false);
  } else if (
    triggeredEventsIncludes(triggeredEvents, ["addDir", "unlinkDir"])
  ) {
    await setState(appInstance, {
      sourceTree: true,
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      menu: true,
      partials: true,
    });
    changeFileCallback(true, true);
  } else if (
    triggeredEvents.filter((event) =>
      helpers.fileIsTemplateFile(appInstance, event.changedPath)
    ).length > 0
  ) {
    if (triggeredEventsIncludes(triggeredEvents, ["add", "unlink"])) {
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
      }
      changeFileCallback(true, true);
    } else if (triggeredEventsIncludes(triggeredEvents, ["change"])) {
      changeFileCallback(true, false);
    }
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsDataFile(appInstance, changedPath)
    )
  ) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      sourceTree: triggeredEventsIncludes(triggeredEvents, ["add", "unlink"]),
      menu: true,
    });
    changeFileCallback(
      true,
      triggeredEventsIncludes(triggeredEvents, ["add", "unlink", "change"])
    );
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsDocumentationFile(appInstance, changedPath)
    )
  ) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
    });
    changeFileCallback(true, false);
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsInfoFile(appInstance, changedPath)
    )
  ) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      menu: true,
    });
    changeFileCallback(true, false);
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsSchemaFile(appInstance, changedPath)
    )
  ) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
    });
    changeFileCallback(true, false);
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsAssetFile(appInstance, changedPath)
    )
  ) {
    if (appInstance.get("config").ui.reloadAfterChanges.componentAssets) {
      changeFileCallback(true, false);
    }
  } else {
    changeFileCallback();
  }
}

/**
 * @param srcFolderIgnores
 */
function getIgnoredPathsArr(srcFolderIgnores) {
  return [
    // ignore dotfiles
    /(^|[\/\\])\../ /* eslint-disable-line */,
    ...srcFolderIgnores.map((dir) => path.resolve(dir)),
  ];
}

module.exports = function Watcher(server, app) {
  appInstance = app;
  ioInstance = socketIo.listen(server);

  const { components, assets } = appInstance.get("config");
  const ignored = getIgnoredPathsArr(components.ignores);
  const foldersToWatch = [components.folder, ...assets.css, ...assets.js];

  chokidar
    .watch(foldersToWatch, {
      ignoreInitial: true,
      ignored,
    })
    .on("all", (event, changedPath) => {
      triggeredEvents.push({ event, changedPath });

      if (!timeout) {
        console.clear();
        log("info", messages.updatingStarted);
        timeout = setTimeout(() => {
          timeout = null;
          handleFileChange();
        }, 10);
      }
    });
};