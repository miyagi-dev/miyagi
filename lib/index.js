/**
 * The miyagi module
 *
 * @module index
 */

const { messages } = require("./config.json");
const initRendering = require("./init/rendering");
const log = require("./logger.js");
const yargs = require("./init/args.js");
const mockGenerator = require("./generator/mocks");
const componentGenerator = require("./generator/component");
const getConfig = require("./config.js");
const { lint } = require("./cli");
const {
	updateConfigForRendererIfNecessary,
	updateConfigWithGuessedExtensionBasedOnEngine,
	updateConfigWithGuessedEngineAndExtensionBasedOnFiles,
} = require("./helpers.js");

/* preload rendering modules */
require("./render/helpers.js");
require("./render");
require("./render/tests.json");

/**
 * Checks if miyagi was started with "mocks" command
 *
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "mocks"
 */
function argsIncludeMockGenerator(args) {
	return args._.includes("mocks");
}

/**
 * Checks if miyagi was started with "new" command
 *
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "new"
 */
function argsIncludeComponentGenerator(args) {
	return args._.includes("new");
}

/**
 * Checks if miyagi was started with "build" command
 *
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "new"
 */
function argsIncludeBuild(args) {
	return args._.includes("build");
}

/**
 * Checks if miyagi was started with "start" command
 *
 * @param {object} args - the cli args
 * @returns {boolean} is true if the miyagi was started with "start"
 */
function argsIncludeServer(args) {
	return args._.includes("start");
}

/**
 * Checks if miyagi was started with "lint" command
 *
 * @param {object} args
 * @returns {boolean}
 */
function argsIncludeLint(args) {
	return args._.includes("lint");
}

/**
 * Runs the component generator
 *
 * @param {object} config - the user configuration object
 * @param {object} args - the cli args
 */
async function runComponentGenerator(config, args) {
	config = await updateConfigForComponentGeneratorIfNecessary(config, args);

	if (config) {
		componentGenerator(args, config);
	}
}

/**
 * Runs the mock generator
 *
 * @param {object} config - the user configuration object
 * @param {object} args - the cli args
 */
function runMockGenerator(config, args) {
	mockGenerator(args._.slice(1)[0], config.files);
}

/**
 * @param {object} config
 */
async function initApi(config) {
	config = await updateConfigForRendererIfNecessary(config);

	return await require("../api/app")(config);
}

/**
 * Updates the config with smartly guessed template extension if missing
 * and tpls are not skipped for generating a component
 *
 * @param {object} config - the user configuration object
 * @param {object} args - the cli args
 * @returns {Promise<object>} the updated config
 */
async function updateConfigForComponentGeneratorIfNecessary(config, args) {
	if (
		!config.files.templates.extension &&
		((args.only && args.only.includes("tpl")) ||
			(args.skip && !args.skip.includes("tpl")) ||
			!args.skip)
	) {
		if (config.engine && config.engine.name) {
			config = updateConfigWithGuessedExtensionBasedOnEngine(config);
		} else {
			config = await updateConfigWithGuessedEngineAndExtensionBasedOnFiles(
				config
			);
		}
	}

	return config;
}

/**
 * Requires the user config and initializes and calls correct modules based on command
 *
 * @param cmd
 */
module.exports = async function Miyagi(cmd) {
	if (cmd === "api") {
		process.env.NODE_ENV = "development";

		const config = getConfig();

		return await initApi(config);
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
				log("info", messages.buildStarting);
			} else {
				if (!process.env.NODE_ENV) {
					process.env.NODE_ENV = "development";
				}

				if (isComponentGenerator) {
					log("info", messages.generator.starting);
				} else if (isServer) {
					log(
						"info",
						messages.serverStarting.replace(
							"{{node_env}}",
							process.env.NODE_ENV
						)
					);
				}
			}

			const config = getConfig(args, isBuild, isComponentGenerator);

			if (isMockGenerator) {
				runMockGenerator(config, args);
			} else if (isComponentGenerator) {
				runComponentGenerator(config, args);
			} else {
				return initRendering(config);
			}
		} else {
			log("error", messages.commandNotFound);
			process.exit(1);
		}
	}
};
