import path from "path";
import deepMerge from "deepmerge";

import getMergedConfig from "./init/config.js";
import log from "./logger.js";

/**
 * @param {object} args
 * @param {boolean} [isBuild]
 * @param {boolean} [isComponentGenerator]
 * @returns {Promise<object>}
 */
export default async function getConfig(args, isBuild, isComponentGenerator) {
	let userFile = {};
	let userFileName;

	try {
		userFileName = ".miyagi.js";
		userFile = await import(
			path.resolve(process.cwd(), `${userFileName}?time=${Date.now()}`)
		);
	} catch (e) {
		log("warn", null, e);
		try {
			userFileName = ".miyagi.mjs";
			userFile = await import(
				path.resolve(process.cwd(), `${userFileName}?time=${Date.now()}`)
			);
		} catch (err) {
			userFileName = null;
			log("warn", null, err);
		}
	}

	let userConfig =
		(args ? deepMerge(userFile.default, getCliArgs(args)) : userFile.default) ??
		{};

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
}

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

	cliArgs.build = buildArgs;

	return cliArgs;
}
