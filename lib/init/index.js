/**
 * Module for initializing miyagi
 *
 * @module init
 */

const express = require("express");
// deepcode ignore HttpToHttps: local server only
const http = require("http");
const cookieParser = require("cookie-parser");

const appConfig = require("../config.json");
const build = require("../build/index.js");
const log = require("../logger.js");
const setEngines = require("./engines.js");
const setRouter = require("./router.js");
const setState = require("../state");
const setStatic = require("./static.js");
const setViews = require("./views.js");
const setWatcher = require("./watcher.js");

module.exports = async function init(mergedConfig) {
	// deepcode ignore UseCsurfForExpress: local server only, deepcode ignore DisablePoweredBy: local server only
	global.app = express();
	global.app.use(cookieParser());
	global.config = mergedConfig;
	global.app.set("view cache", false);
	global.app.set("cache", false);

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
			log("info", "Writing files…");
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
			global.app.get("port")
		);

		setWatcher(server);

		log(
			"success",
			`${appConfig.messages.serverStarted.replace("{{port}}", actualPort)}\n`
		);

		return server;
	}

	return false;
};

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
					log("error", appConfig.messages.portInUse.replace("{{port}}", port));
					server.close(async function () {
						const response = await startServer(port + 1);

						resolve(response);
					});
				}
			});
	});
}
