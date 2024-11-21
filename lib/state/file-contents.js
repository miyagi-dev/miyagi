/**
 * Module for getting the content of all relevant files
 * @module stateFilecontents
 */

import { readFile as readFileFs } from "node:fs/promises";
import path from "path";
import anymatch from "anymatch";
import yaml from "js-yaml";
import { marked as Markdown } from "marked";
import * as helpers from "../helpers.js";
import log from "../logger.js";

/**
 * Checks if a given array of file paths includes a given file path
 * @param {string} file - file path string
 * @param {Array} fileNames - array of file path string
 * @returns {boolean} is true if given array includes given file path
 */
function checkIfFileNamesIncludeFile(file, fileNames) {
	return fileNames.includes(path.basename(file));
}

/**
 * Returns all component and docs file from components.folder
 * @param {object} sourceTree
 * @returns {Promise<string[]>}
 */
async function getFilePaths(sourceTree) {
	const { assets, components, files } = global.config;

	const paths = [...assets.customProperties.files];

	if (sourceTree.components) {
		(function getPaths(entry) {
			if (!anymatch(components.ignores, entry.path)) {
				if (entry.type === "file") {
					if (
						checkIfFileNamesIncludeFile(entry.path, [
							`${helpers.getResolvedFileName(
								files.templates.name,
								path.basename(entry.path, `.${files.templates.extension}`),
							)}.${files.templates.extension}`,
							`${files.mocks.name}.${files.mocks.extension[0]}`,
							`${files.mocks.name}.${files.mocks.extension[1]}`,
							`${files.schema.name}.${files.schema.extension}`,
							`data.${files.mocks.extension[0]}`,
							`data.${files.mocks.extension[1]}`,
						]) ||
						helpers.fileIsDocumentationFile(entry.path)
					) {
						paths.push(entry.path);
					}
				} else if (entry.type === "directory") {
					entry.children.forEach((item) => getPaths(item));
				}
			}
		})(sourceTree.components);
	}

	if (sourceTree.docs) {
		(function getPaths(entry) {
			if (entry.type === "file") {
				paths.push(entry.path);
			} else if (entry.type === "directory") {
				entry.children.forEach((item) => getPaths(item));
			}
		})(sourceTree.docs);
	}

	return paths;
}

/**
 * Calls the default export of an ES module and returns its return value
 * or returns the return value directly if it is not a function
 * @param {string} fileName - file path string
 * @returns {Promise<string>} - the default export of the ES module
 */
async function getJsFileContent(fileName) {
	const file = await import(path.resolve(`${fileName}?time=${Date.now()}`));

	return file.default();
}

/**
 * Returns the content of a YAML file parsed as JSON object
 * @param {string} fileName - path to a yaml file
 * @returns {Promise<object>} the content of the given file as an object
 */
async function getYamlFileContent(fileName) {
	try {
		const result = await readFileFs(fileName, "utf8");
		return yaml.load(result);
	} catch (err) {
		return Promise.reject(err);
	}
}

/**
 * Returns the parsed content of a JSON file.
 * @param {string} fileName - path to a json file
 * @returns {Promise<object>} the parsed content of the given file
 */
async function getParsedJsonFileContent(fileName) {
	try {
		const result = await readFileFs(fileName, "utf8");
		return JSON.parse(result);
	} catch (err) {
		return Promise.reject(err);
	}
}

/**
 * Returns the as HTML rendered content of markdown files.
 * @param {string} fileName - path to a markdown file
 * @returns {Promise<string>} the markdown of the given file converted into HTML
 */
async function getConvertedMarkdownFileContent(fileName) {
	try {
		const result = await readFileFs(fileName, "utf8");
		return Markdown.parse(result);
	} catch (err) {
		return Promise.reject(err);
	}
}

/**
 * Calls different functions getting the file's content based on its type
 * and returns the (converted) file content.
 * @param {string} fileName - path to a file of any type
 * @returns {Promise<string|object|Array>} content of the given file based on its type
 */
export const readFile = async function (fileName) {
	switch (true) {
		case [".yaml", ".yml"].includes(path.extname(fileName)):
			{
				try {
					return await getYamlFileContent(fileName);
				} catch (err) {
					log("error", `Error when reading file ${fileName}`, err);
				}
			}
			break;
		case helpers.fileIsDocumentationFile(fileName):
			{
				try {
					return await getConvertedMarkdownFileContent(fileName);
				} catch (err) {
					log("error", `Error when reading file ${fileName}`, err);
				}
			}
			break;
		case helpers.fileIsDataFile(fileName) &&
			[".js", ".mjs"].includes(path.extname(fileName)):
			{
				try {
					return await getJsFileContent(fileName);
				} catch (err) {
					log("error", `Error when reading file ${fileName}`, err);
				}
			}
			break;
		case fileName.endsWith(".json"):
			{
				try {
					return await getParsedJsonFileContent(fileName);
				} catch (err) {
					log("error", `Error when reading file ${fileName}`, err);
				}
			}
			break;
		default: {
			try {
				return await readFileFs(fileName, { encoding: "utf8" });
			} catch (err) {
				log("error", `Error when reading file ${fileName}`, err);
			}
		}
	}
};

/**
 * Returns a promise which will be resolved with an object,
 * including all component files (except for template files)
 * and their content.
 * @param {object} sourceTree
 * @returns {Promise} gets resolved with the content of all docs, mocks, schema files
 */
export const getFileContents = async function (sourceTree) {
	const fileContents = {};
	const paths = await getFilePaths(sourceTree);

	if (paths) {
		await Promise.all(
			paths.map(async (fullPath) => {
				try {
					fileContents[fullPath] = await readFile(fullPath.replace(/\0/g, ""));
				} catch (err) {
					return err;
				}
			}),
		);

		return fileContents;
	}

	return {};
};
