/**
 * Module for initializing miyagi
 * @module init
 */

import express from "express";
// deepcode ignore HttpToHttps: local server only
import http from "http";
import cookieParser from "cookie-parser";

import appConfig from "../default-config.js";
import { t } from "../i18n/index.js";
import build from "../build/index.js";
import log from "../logger.js";
import setEngines from "./engines.js";
import setRouter from "./router.js";
import setState from "../state/index.js";
import setStatic from "./static.js";
import setViews from "./views.js";
import setWatcher from "./watcher.js";

export default async function init(mergedConfig) {
	// deepcode ignore UseCsurfForExpress: local server only, deepcode ignore DisablePoweredBy: local server only
	global.app = express();
	global.app.use(cookieParser());
	global.config = mergedConfig;
	global.app.set("view cache", global.config.isBuild);
	global.app.set("cache", global.config.isBuild);

	if (await setEngines()) {
		const port = process.env.PORT || appConfig.defaultPort;

		global.app.set("port", port);

		await setState({
			sourceTree: true,
			menu: true,
			partials: true,
			fileContents: true,
			css: true,
		});

		setStatic();
		setRouter();
		setViews();

		if (global.config.isBuild) {
			return build()
				.then((message) => {
					log("success", message);
					process.exit(0);
				})
				.catch((error) => {
					log("error", error);
					process.exit(1);
				});
		}

		const { server, port: actualPort } = await startServer(
			global.app.get("port"),
		);

		setWatcher(server);

		log("success", `${t("serverStarted").replace("{{port}}", actualPort)}\n`);

		return server;
	}

	return false;
}

/**
 * @param {number} port - the port that should be used
 * @returns {Promise} gets resolved with the server instance and the actual port
 */
function startServer(port) {
	const server = http.createServer(global.app);

	return new Promise((resolve) => {
		server
			.listen(port, function () {
				resolve({ server, port });
			})
			.on("error", (error) => {
				if (error.code === "EADDRINUSE") {
					log(
						"error",
						t("portInUse").replace("{{port}}", port),
						error.toString(),
					);
					server.close(async function () {
						const response = await startServer(port + 1);

						resolve(response);
					});
				}
			});
	});
}
