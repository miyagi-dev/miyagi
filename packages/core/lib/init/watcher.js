/**
 * Module for watching user file changes
 *
 * @module initWatcher
 */

import anymatch from "anymatch";
import fs from "fs";
import path from "path";
import watch from "node-watch";
import { Server } from "socket.io";
import getConfig from "../config.js";
import yargs from "./args.js";
import setState from "../state/index.js";
import { readFile } from "../state/file-contents.js";
import {
  cloneDeep,
  fileIsTemplateFile,
  fileIsDataFile,
  fileIsDocumentationFile,
  fileIsInfoFile,
  fileIsSchemaFile,
  fileIsAssetFile,
  updateConfigForRendererIfNecessary,
} from "../helpers.js";
import log from "../logger.js";
import { messages } from "../miyagi-config.js";
import setEngines from "./engines.js";
import setPartials from "./partials.js";
import setStatic from "./static.js";
import setViewHelpers from "./view-helpers.js";
import setViews from "./views.js";

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
  const data = cloneDeep(app.get("state").fileContents);
  const promises = [];

  for (const { event, changedPath } of events) {
    if (
      fileIsTemplateFile(app, changedPath) ||
      fileIsDataFile(app, changedPath) ||
      fileIsDocumentationFile(app, changedPath) ||
      fileIsInfoFile(app, changedPath) ||
      fileIsSchemaFile(app, changedPath)
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
      fileIsTemplateFile(appInstance, event.changedPath)
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
      fileIsDataFile(appInstance, changedPath)
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
      fileIsDocumentationFile(appInstance, changedPath)
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
      fileIsInfoFile(appInstance, changedPath)
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
      fileIsSchemaFile(appInstance, changedPath)
    )
  ) {
    await setState(appInstance, {
      fileContents: await updateFileContents(appInstance, triggeredEvents),
    });

    changeFileCallback(true, false);
    // updated file is an asset file
  } else if (
    triggeredEvents.some(({ changedPath }) =>
      fileIsAssetFile(appInstance, changedPath)
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

export default function Watcher(server, app) {
  appInstance = app;
  ioInstance = new Server(server);

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
      .map((file) => file.src)
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

  let watcher;

  try {
    watcher = watch(foldersToWatch, {
      recursive: true,
      filter(f, skip) {
        if (anymatch(components.ignores, f)) return skip;
        return true;
      },
    });
  } catch (e) {
    log("error", e.message);
  }

  if (watcher) {
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
  } else {
    log("error", messages.watchingFilesFailed);
  }
}

async function configurationFileUpdated(app) {
  log("info", messages.updatingConfiguration);
  delete require.cache[require.resolve(path.resolve(process.cwd(), ".miyagi"))];

  const config = await updateConfigForRendererIfNecessary(
    await getConfig(yargs.argv)
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
