/**
 * The miyagi module
 * @module index
 */

import { t } from "./i18n/index.js";
import initRendering from "./init/rendering.js";
import log from "./logger.js";
import yargs from "./init/args.js";
import mockGenerator from "./generator/mocks.js";
import getConfig from "./config.js";
import { lint, component as createComponentViaCli } from "./cli/index.js";
import apiApp from "../api/app.js";

/**
 * Checks if miyagi was started with "mocks" command
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "mocks"
 */
function argsIncludeMockGenerator(args) {
	return args._.includes("mocks");
}

/**
 * Checks if miyagi was started with "new" command
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "new"
 */
function argsIncludeComponentGenerator(args) {
	return args._.includes("new");
}

/**
 * Checks if miyagi was started with "build" command
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "new"
 */
function argsIncludeBuild(args) {
	return args._.includes("build");
}

/**
 * Checks if miyagi was started with "start" command
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "start"
 */
function argsIncludeServer(args) {
	return args._.includes("start");
}

/**
 * Checks if miyagi was started with "lint" command
 * @param {object} args
 * @returns {boolean}
 */
function argsIncludeLint(args) {
	return args._.includes("lint");
}

/**
 * Runs the mock generator
 * @param {object} config - the user configuration object
 * @param {object} args - the cli args
 */
function runMockGenerator(config, args) {
	mockGenerator(args._.slice(1)[0], config.files).catch(() => {});
}

/**
 * @param {object} config
 */
async function initApi(config) {
	return await apiApp(config);
}

/**
 * Requires the user config and initializes and calls correct modules based on command
 * @param {string} cmd
 * @param {object} options
 * @param {boolean} options.isBuild
 */
export default async function Miyagi(cmd, { isBuild } = {}) {
	if (cmd === "api") {
		process.env.NODE_ENV = "development";

		global.config = await getConfig(null, isBuild);

		return await initApi(global.config);
	} else {
		let args;
		let isServer;
		let isBuild;
		let isComponentGenerator;
		let isMockGenerator;
		let isLinter;

		if (cmd) {
			isBuild = cmd === "build";
		} else {
			args = yargs.argv;
			isServer = argsIncludeServer(args);
			isBuild = argsIncludeBuild(args);
			isComponentGenerator = argsIncludeComponentGenerator(args);
			isMockGenerator = argsIncludeMockGenerator(args);
			isLinter = argsIncludeLint(args);
		}

		process.env.VERBOSE = args.verbose;

		if (isLinter) {
			lint(args);
		} else if (isBuild || isComponentGenerator || isServer || isMockGenerator) {
			if (isBuild) {
				process.env.NODE_ENV = "production";
				log("info", t("buildStarting"));
			} else {
				if (!process.env.NODE_ENV) {
					process.env.NODE_ENV = "development";
				}

				if (isComponentGenerator) {
					log("info", t("generator.starting"));
				} else if (isServer) {
					log(
						"info",
						t("serverStarting").replace("{{node_env}}", process.env.NODE_ENV),
					);
				}
			}

			global.config = await getConfig(args, isBuild, isComponentGenerator);

			if (!global.config.components.folder && !global.config.docs.folder) {
				log(
					"error",
					"Please specify at least either components.folder or docs.folder in your configuration file.",
				);
				process.exit(1);
			}

			if (isMockGenerator) {
				runMockGenerator(global.config, args);
			} else if (isComponentGenerator) {
				createComponentViaCli(args);
			} else {
				return initRendering(global.config);
			}
		} else {
			log("error", t("commandNotFound"));
			process.exit(1);
		}
	}
}
