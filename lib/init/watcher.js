/**
 * Module for watching user file changes
 * @module initWatcher
 */

import anymatch from "anymatch";
import fs from "fs";
import path from "path";
import watch from "node-watch";
import { WebSocketServer } from "ws";
import getConfig from "../config.js";
import yargs from "./args.js";
import setState from "../state/index.js";
import { readFile } from "../state/file-contents.js";
import * as helpers from "../helpers.js";
import log from "../logger.js";
import { t } from "../i18n/index.js";
import setEngines from "./engines.js";
import setStatic from "./static.js";
import setViews from "./views.js";

let triggeredEvents = [];
let timeout;

/**
 * @param {boolean} [reload] - is true if the page should be reloaded
 * @param {boolean} [reloadParent] - is true if the parent window should be reloaded
 */
function changeFileCallback(reload, reloadParent) {
	if (reload && global.config.ui.reload) {
		// ioInstance.emit("fileChanged", reloadParent);
		sockets.forEach((ws) => {
			ws.send(reloadParent ? "reloadParent" : "");
		});
	}

	triggeredEvents = [];
	log("success", `${t("updatingDone")}\n`);
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
 * @param {object[]} events - array of event objects
 * @returns {Promise<object>} the updated state.fileContents object
 */
async function updateFileContents(events) {
	const data = helpers.cloneDeep(global.state.fileContents);
	const promises = [];

	for (const { event, changedPath } of events) {
		if (
			fs.existsSync(changedPath) &&
			fs.lstatSync(changedPath).isFile() &&
			(helpers.fileIsTemplateFile(changedPath) ||
				helpers.fileIsDataFile(changedPath) ||
				helpers.fileIsDocumentationFile(changedPath) ||
				helpers.fileIsSchemaFile(changedPath))
		) {
			const fullPath = path.join(process.cwd(), changedPath);

			if (event === "update") {
				promises.push(
					new Promise((resolve, reject) => {
						readFile(changedPath)
							.then((result) => {
								data[fullPath] = result;
								resolve();
							})
							.catch((err) => {
								console.error(err);
								reject();
							});
					}),
				);
			} else if (event === "remove") {
				promises.push(
					new Promise((resolve) => {
						delete data[fullPath];
						resolve();
					}),
				);
			}
		}
	}

	return Promise.all(promises)
		.then(() => {
			return data;
		})
		.catch((err) => console.error(err));
}

/**
 *
 */
async function handleFileChange() {
	for (const extension of global.config.extensions) {
		const ext = Array.isArray(extension) ? extension[0] : extension;
		const opts =
			Array.isArray(extension) && extension[1] ? extension[1] : { locales: {} };

		if (ext.callbacks?.fileChanged) {
			await ext.callbacks.fileChanged(opts);
		}
	}

	// a directory has been changed
	if (
		triggeredEvents.some(
			({ changedPath }) =>
				fs.existsSync(changedPath) && fs.lstatSync(changedPath).isDirectory(),
		)
	) {
		await setState({
			sourceTree: true,
			fileContents: true,
			menu: true,
			partials: true,
		});

		changeFileCallback(true, true);
	}

	// removed a directory or file
	else if (triggeredEventsIncludes(triggeredEvents, ["remove"])) {
		await setState({
			sourceTree: true,
			fileContents: await updateFileContents(triggeredEvents),
			menu: true,
			partials: true,
		});

		changeFileCallback(true, true);
		// updated file is a template file
	} else if (
		triggeredEvents.filter((event) =>
			helpers.fileIsTemplateFile(event.changedPath),
		).length > 0
	) {
		if (
			Object.keys(global.state.partials).includes(
				triggeredEvents[0].changedPath.replace(
					path.join(global.config.components.folder, "/"),
					"",
				),
			)
		) {
			// updated
			await setState({
				fileContents: await updateFileContents(triggeredEvents),
			});

			changeFileCallback(true, false);
		} else {
			// added
			await setState({
				fileContents: await updateFileContents(triggeredEvents),
				sourceTree: true,
				menu: true,
				partials: true,
			});

			changeFileCallback(true, true);
		}
		// updated file is a mock file
	} else if (
		triggeredEvents.some(({ changedPath }) =>
			helpers.fileIsDataFile(changedPath),
		)
	) {
		const hasBeenAdded = !Object.keys(global.state.fileContents).includes(
			path.join(process.cwd(), triggeredEvents[0].changedPath),
		);

		await setState({
			fileContents: await updateFileContents(triggeredEvents),
			sourceTree: hasBeenAdded,
			menu: true,
		});

		changeFileCallback(true, true);
		// updated file is a doc file
	} else if (
		triggeredEvents.some(({ changedPath }) =>
			helpers.fileIsDocumentationFile(changedPath),
		)
	) {
		const hasBeenAdded = !Object.keys(global.state.fileContents).includes(
			path.join(process.cwd(), triggeredEvents[0].changedPath),
		);

		await setState({
			fileContents: await updateFileContents(triggeredEvents),
			sourceTree: hasBeenAdded,
			menu: hasBeenAdded,
		});

		changeFileCallback(true, hasBeenAdded);
		// updated file is a schema file
	} else if (
		triggeredEvents.some(({ changedPath }) =>
			helpers.fileIsSchemaFile(changedPath),
		)
	) {
		await setState({
			fileContents: await updateFileContents(triggeredEvents),
		});

		changeFileCallback(true, false);
		// updated file is an asset file
	} else if (
		triggeredEvents.some(({ changedPath }) =>
			helpers.fileIsAssetFile(changedPath),
		)
	) {
		if (global.config.ui.reloadAfterChanges.componentAssets) {
			changeFileCallback(true, false);
		}
		// updated file is a css file
	} else if (
		triggeredEvents.find(({ changedPath }) => {
			return changedPath.endsWith(".css");
		})
	) {
		// updated file contains custom properties for the styleguide
		if (
			triggeredEvents.find(({ changedPath }) => {
				return global.config.assets.customProperties.files.includes(
					changedPath,
				);
			})
		) {
			await setState({
				css: true,
			});
		} else {
			await setState({
				menu: true,
			});
		}

		if (global.config.ui.reloadAfterChanges.componentAssets) {
			changeFileCallback(true, false);
		}
		// updated file is a js file
	} else if (
		triggeredEvents.find(({ changedPath }) => {
			return changedPath.endsWith(".js");
		})
	) {
		await setState({
			menu: true,
		});

		if (global.config.ui.reloadAfterChanges.componentAssets) {
			changeFileCallback(true, false);
		}
	} else {
		await setState({
			sourceTree: true,
			fileContents: true,
			menu: true,
			partials: true,
		});

		changeFileCallback(true, true);
	}
}

const sockets = [];

export default function Watcher(server) {
	const wss = new WebSocketServer({ noServer: true });

	wss.on("connection", function open(ws) {
		sockets.push(ws);
	});

	server.on("upgrade", (request, socket, head) => {
		wss.handleUpgrade(request, socket, head, (ws) => {
			wss.emit("connection", ws, request);
		});
	});

	const { components, docs, assets, extensions } = global.config;

	const foldersToWatch = [
		...assets.folder.map((f) => path.join(global.config.assets.root, f)),
		...assets.css
			.filter(
				(f) =>
					!f.startsWith("http://") &&
					!f.startsWith("https://") &&
					!f.startsWith("://"),
			)
			.map((f) => path.join(global.config.assets.root, f)),
		...assets.js
			.map((file) => file.src)
			.filter(
				(f) =>
					!f.startsWith("http://") &&
					!f.startsWith("https://") &&
					!f.startsWith("://"),
			)
			.map((f) => path.join(global.config.assets.root, f)),
	];

	if (components.folder) {
		foldersToWatch.push(components.folder);
	}

	if (docs?.folder && fs.existsSync(docs.folder)) {
		foldersToWatch.push(docs.folder);
	}

	for (const extension of extensions) {
		const ext = Array.isArray(extension) ? extension[0] : extension;
		const opts =
			Array.isArray(extension) && extension[1] ? extension[1] : { locales: {} };

		if (ext.extendWatcher) {
			const watch = ext.extendWatcher(opts);
			foldersToWatch.push(path.join(watch.folder, watch.lang));
		}
	}

	if (global.config.userFileName) {
		fs.watch(global.config.userFileName, async (eventType) => {
			if (eventType === "change") {
				configurationFileUpdated();
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
		log("error", e);
	}

	if (watcher) {
		watcher.on("change", (event, changedPath) => {
			triggeredEvents.push({ event, changedPath });

			if (!timeout) {
				console.clear();
				log("info", t("updatingStarted"));
				timeout = setTimeout(() => {
					timeout = null;
					handleFileChange();
				}, 10);
			}
		});
	} else {
		log("error", t("watchingFilesFailed"));
	}
}

/**
 * @returns {void}
 */
async function configurationFileUpdated() {
	log("info", t("updatingConfiguration"));

	const config = await getConfig(yargs.argv);

	if (config) {
		global.config = config;
		await setEngines();
		await setState({
			sourceTree: true,
			menu: true,
			partials: true,
			fileContents: true,
			css: true,
		});
		setStatic();
		setViews();

		log("success", `${t("updatingConfigurationDone")}\n`);
		changeFileCallback(true, true);
	}
}
