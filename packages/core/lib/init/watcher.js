/**
 * Module for watching user file changes
 *
 * @module initWatcher
 */

const anymatch = require("anymatch");
const fs = require("fs");
const path = require("path");
const watch = require("node-watch");
const socketIo = require("socket.io");
const getConfig = require("../config");
const yargs = require("./args.js");
const setState = require("../state");
const { readFile } = require("../state/file-contents.js");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const { messages } = require("../config.json");
const setEngines = require("./engines.js");
const setPartials = require("./partials.js");
const setStatic = require("./static.js");
const setViewHelpers = require("./view-helpers.js");
const setViews = require("./views.js");

let triggeredEvents = [];
let foldersToWatch;
let timeout;
let appInstance;
let ioInstance;

/**
 * @param {boolean} [reload] - is true if the page should be reloaded
 * @param {boolean} [reloadParent] - is true if the parent window should be reloaded
 */
function changeFileCallback(reload, reloadParent) {
  if (reload && appInstance.get("config").ui.reload) {
    ioInstance.emit("fileChanged", reloadParent);
  }

  triggeredEvents = [];
  log("success", `${messages.updatingDone}\n`);
}

/**
 * @param {Array} triggered - the triggered events
 * @param {Array} events - array of events to check against
 * @returns {boolean} is true if the triggered events include the events to check against
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
 * @param {object[]} events - array of event objects
 * @returns {Promise<object>} the updated state.fileContents object
 */
async function updateFileContents(app, events) {
  const data = helpers.cloneDeep(app.get("state").fileContents);
  const promises = [];

  for (const { event, changedPath } of events) {
    if (
      helpers.fileIsTemplateFile(app, changedPath) ||
      helpers.fileIsDataFile(app, changedPath) ||
      helpers.fileIsDocumentationFile(app, changedPath) ||
      helpers.fileIsInfoFile(app, changedPath) ||
      helpers.fileIsSchemaFile(app, changedPath)
    ) {
      const fullPath = path.join(process.cwd(), changedPath);

      if (event === "update") {
        promises.push(
          new Promise((resolve) => {
            readFile(app, changedPath).then((result) => {
              data[fullPath] = result;
              resolve();
            });
          })
        );
      } else if (event === "remove") {
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
  for (const extension of appInstance.get("config").extensions) {
    const ext = Array.isArray(extension) ? extension[0] : extension;
    const opts =
      Array.isArray(extension) && extension[1] ? extension[1] : { locales: {} };

    if (ext.callbacks?.fileChanged) {
      await ext.callbacks.fileChanged(opts);
    }
  }

  // removed a directory or file
  if (triggeredEventsIncludes(triggeredEvents, ["remove"])) {
    await setState(appInstance, {
      sourceTree: true,
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      menu: true,
      partials: true,
    });

    changeFileCallback(true, true);

    // updated file is a css file
  } else if (
    triggeredEvents.find(({ changedPath }) => {
      return changedPath.endsWith(".css");
    })
  ) {
    // updated file contains custom properties for the styleguide
    if (
      triggeredEvents.find(({ changedPath }) => {
        return appInstance
          .get("config")
          .assets.customProperties.files.includes(changedPath);
      })
    ) {
      await setState(appInstance, {
        css: true,
      });
    }

    changeFileCallback(true, false);
    // updates file is a js file
  } else if (
    triggeredEvents.find(({ changedPath }) => {
      return changedPath.endsWith(".js");
    })
  ) {
    changeFileCallback(true, false);
    // updated file is a template file
  } else if (
    triggeredEvents.filter((event) =>
      helpers.fileIsTemplateFile(appInstance, event.changedPath)
    ).length > 0
  ) {
    if (
      Object.keys(appInstance.get("state").partials).includes(
        triggeredEvents[0].changedPath.replace(
          path.join(appInstance.get("config").components.folder, "/"),
          ""
        )
      )
    ) {
      // updated
      await setState(appInstance, {
        fileContents: await updateFileContents(appInstance, triggeredEvents),
      });

      changeFileCallback(true, false);
    } else {
      // added
      await setState(appInstance, {
        fileContents: await updateFileContents(appInstance, triggeredEvents),
        sourceTree: true,
        menu: true,
        partials: true,
      });

      await setPartials.registerPartial(
        appInstance,
        triggeredEvents.find((event) => event.event === "update").changedPath
      );

      changeFileCallback(true, true);
    }
    // updated file is a mock file
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsDataFile(appInstance, changedPath)
    )
  ) {
    const hasBeenAdded = !Object.keys(
      appInstance.get("state").fileContents
    ).includes(path.join(process.cwd(), triggeredEvents[0].changedPath));

    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      sourceTree: hasBeenAdded,
      menu: true,
    });

    changeFileCallback(true, true);
    // updated file is a doc file
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsDocumentationFile(appInstance, changedPath)
    )
  ) {
    const hasBeenAdded = !Object.keys(
      appInstance.get("state").fileContents
    ).includes(path.join(process.cwd(), triggeredEvents[0].changedPath));

    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      sourceTree: hasBeenAdded,
      menu: hasBeenAdded,
    });

    changeFileCallback(true, hasBeenAdded);
    // updated file is an info file
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsInfoFile(appInstance, changedPath)
    )
  ) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
      menu: true,
    });

    changeFileCallback(true, true);
    // updated file is a schema file
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsSchemaFile(appInstance, changedPath)
    )
  ) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
    });

    changeFileCallback(true, false);
    // updated file is an asset file
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      helpers.fileIsAssetFile(appInstance, changedPath)
    )
  ) {
    if (appInstance.get("config").ui.reloadAfterChanges.componentAssets) {
      changeFileCallback(true, false);
    }
  } else {
    await setState(appInstance, {
      sourceTree: true,
      fileContents: true,
      menu: true,
      partials: true,
    });

    changeFileCallback(true, true);
  }
}

module.exports = function Watcher(server, app) {
  appInstance = app;
  ioInstance = socketIo(server);

  const { components, assets, extensions } = appInstance.get("config");

  foldersToWatch = [
    components.folder,
    ...assets.folder.map((f) => path.join(app.get("config").assets.root, f)),
    ...assets.css
      .filter(
        (f) =>
          !f.startsWith("http://") &&
          !f.startsWith("https://") &&
          !f.startsWith("://")
      )
      .map((f) => path.join(app.get("config").assets.root, f)),
    ...assets.js
      .filter(
        (f) =>
          !f.startsWith("http://") &&
          !f.startsWith("https://") &&
          !f.startsWith("://")
      )
      .map((f) => path.join(app.get("config").assets.root, f)),
  ];

  for (const extension of extensions) {
    const ext = Array.isArray(extension) ? extension[0] : extension;
    const opts =
      Array.isArray(extension) && extension[1] ? extension[1] : { locales: {} };

    if (ext.extendWatcher) {
      const watch = ext.extendWatcher(opts);

      foldersToWatch.push(path.join(watch.folder, watch.lang));
    }
  }

  if (app.get("config").userFileName) {
    fs.watch(app.get("config").userFileName, async (eventType) => {
      if (eventType === "change") {
        configurationFileUpdated(app);
      }
    });
  }

  const watcher = watch(foldersToWatch, {
    recursive: true,
    filter(f, skip) {
      if (anymatch(components.ignores, f)) return skip;
      return true;
    },
  });

  watcher.on("change", (event, changedPath) => {
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

async function configurationFileUpdated(app) {
  log("info", messages.updatingConfiguration);
  delete require.cache[require.resolve(path.resolve(process.cwd(), ".miyagi"))];

  const config = await helpers.updateConfigForRendererIfNecessary(
    getConfig(yargs.argv)
  );
  if (config) {
    app.set("config", config);
    await setEngines(app);
    await setState(app, {
      sourceTree: true,
      menu: true,
      partials: true,
      fileContents: true,
      css: true,
    });
    setStatic(app);
    setViews(app);
    setViewHelpers(app);
    await setPartials.registerAll(app);

    log("success", `${messages.updatingConfigurationDone}\n`);
    ioInstance.emit("fileChanged", true);
  }
}
