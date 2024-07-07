const path = require("path");
const deepMerge = require("deepmerge");

const { t } = require("./i18n");
const getMergedConfig = require("./init/config.js");
const log = require("./logger.js");

module.exports = function getConfig(args, isBuild, isComponentGenerator) {
	let userFile = {};
	let userFileName = ".miyagi.js";

	try {
		userFile = require(path.resolve(process.cwd(), userFileName));
		// eslint-disable-next-line no-unused-vars
	} catch (e) {
		try {
			userFileName = ".miyagi.json";
			userFile = require(path.resolve(process.cwd(), userFileName));
			// eslint-disable-next-line no-unused-vars
		} catch (err) {
			userFileName = null;
			log("warn", t("userConfigUnparseable"));
		}
	}

	let userConfig = args ? deepMerge(userFile, getCliArgs(args)) : userFile;

	userConfig.userFileName = userFileName;
	userConfig.isBuild = isBuild;
	userConfig.isComponentGenerator = isComponentGenerator;
	userConfig.indexPath = {
		default: isBuild ? "component-all.html" : "/component?file=all",
		embedded: isBuild
			? "component-all-embedded.html"
			: "/component?file=all&embedded=true",
	};

	delete userConfig._;

	return getMergedConfig(userConfig);
};

/**
 * Converts and removes unnecessary cli args
 * @param {object} args - the cli args
 * @returns {object} configuration object based on cli args
 */
function getCliArgs(args) {
	const cliArgs = { ...args };
	const buildArgs = {};

	delete cliArgs._;
	delete cliArgs.$0;

	if (cliArgs.folder) {
		buildArgs.folder = cliArgs.folder;
		delete cliArgs.folder;
	}

	if (cliArgs.outputFile) {
		buildArgs.outputFile = cliArgs.outputFile;
		delete cliArgs.outputFile;
	}

	if (cliArgs.basePath) {
		buildArgs.basePath = cliArgs.basePath;
		delete cliArgs.basePath;
	}

	cliArgs.build = buildArgs;

	return cliArgs;
}
