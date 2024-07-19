/**
 * The miyagi module
 * @module index
 */

const { t } = require("./i18n");
const initRendering = require("./init/rendering");
const log = require("./logger.js");
const yargs = require("./init/args.js");
const mockGenerator = require("./generator/mocks");
const getConfig = require("./config.js");
const { lint, component: createComponentViaCli } = require("./cli");

/* preload rendering modules */
require("./render/helpers.js");
require("./render");

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
	return await require("../api/app")(config);
}

/**
 * Requires the user config and initializes and calls correct modules based on command
 * @param {string} cmd
 * @param {object} options
 * @param {boolean} options.isBuild
 */
module.exports = async function Miyagi(cmd, { isBuild } = {}) {
	if (cmd === "api") {
		process.env.NODE_ENV = "development";

		global.config = getConfig(null, isBuild);

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

			global.config = getConfig(args, isBuild, isComponentGenerator);

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
};
