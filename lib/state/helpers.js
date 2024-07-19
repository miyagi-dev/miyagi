/**
 * Helper functions for all state modules
 * @module stateHelpers
 */

import path from "path";
import log from "../logger.js";
import { t } from "../i18n/index.js";
import { readdir } from "node:fs/promises";

/**
 * @param {string|null} dir - the directory in which to look for files
 * @param {string[]} ignores - an array of folders which should be ignored
 * @param {string} configPath
 * @param {string} type
 * @param {Function} check - checks if the file should be returned, returns null or the file path
 * @returns {Promise<string[]>} an array with file paths
 */
async function getFiles(dir, ignores, configPath, type, check) {
	if (dir === null) return [];

	try {
		var entries = await readdir(path.join(process.cwd(), dir), {
			withFileTypes: true,
		});
	} catch (error) {
		if (error.code === "ENOENT") {
			log(
				"error",
				t("srcFolderNotFound")
					.replaceAll("{{directory}}", dir)
					.replaceAll("{{type}}", type)
					.replaceAll("{{config}}", configPath),
			);
			process.exit(1);
		} else {
			log("error", error.toString(), error);
			process.exit(1);
		}
	}

	const files = await Promise.all(
		entries.map(async (entry) => {
			const res = path.resolve(dir, entry.name);

			if (isNotIgnored(res, ignores)) {
				if (entry.isDirectory() || entry.isSymbolicLink()) {
					return await getFiles(
						path.join(dir, entry.name),
						ignores,
						configPath,
						type,
						check,
					);
				} else {
					return check(res);
				}
			} else {
				return null;
			}
		}),
	);

	return Array.prototype.concat(...files).filter((file) => file !== null);
}

/**
 * Checks if a given file is not in one of the ignored folders
 * @param {string} file - file path
 * @param {Array} ignoredFolders - folders that should be ignored
 * @returns {boolean} returns true if the given file is not inside any of the given ignoredFolders
 */
function isNotIgnored(file, ignoredFolders) {
	for (let i = 0; i < ignoredFolders.length; i += 1) {
		if (file.includes(ignoredFolders[i])) {
			return false;
		}
	}

	return true;
}

export default {
	getFiles,
	isNotIgnored,
};
