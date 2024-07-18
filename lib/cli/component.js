const generateComponent = require("../generator/component");
const log = require("../logger");
const { defaultUserConfig } = require("../config.json");
const { t } = require("../i18n");

module.exports = async function createComponentViaCli(cliParams) {
	const commands = cliParams._.slice(1);

	if (commands.length === 0) {
		log("error", t("generator.noComponentNameDefined"));

		return;
	}

	const [component] = commands;
	const fileTypes = getFileTypesFromCliArgs(
		cliParams,
		Object.values(defaultUserConfig.files).map((file) => file.abbr),
	);

	try {
		const result = await generateComponent({ component, fileTypes });
		log("success", result);
	} catch (message) {
		log("error", message);
	}
};

/**
 * Returns an array with file names, if necessary filtered based on args
 * @param {object} args - the cli args
 * @param {Array} fileTypes
 * @returns {Array} all file paths that should be created
 */
function getFileTypesFromCliArgs(args, fileTypes) {
	if (args) {
		if (args.skip) {
			const files = [];
			for (const fileType of fileTypes) {
				if (!args.skip.includes(fileType)) {
					files.push(fileType);
				}
			}
			return files;
		}
		if (args.only) {
			return args.only;
		}
		return fileTypes;
	}
	return fileTypes;
}
