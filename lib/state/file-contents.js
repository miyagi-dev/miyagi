/**
 * Module for getting the content of all relevant files
 * @module stateFilecontents
 */

import path from "path";
import anymatch from "anymatch";
import fs from "fs";
import yaml from "js-yaml";
import { marked as Markdown } from "marked";
import { t } from "../i18n/index.js";
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
 * @returns {string[]}
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
 * @returns {object} the content of the given file as an object
 */
function getYamlFileContent(fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, "utf8", (err, result) => {
			if (err) {
				reject(err);
			} else {
				let object = {};

				try {
					object = yaml.load(result);
					// eslint-disable-next-line no-unused-vars
				} catch (e) {
					log(
						"warn",
						t("jsonFileHasInvalidFormat").replace(
							"{{filePath}}",
							helpers.getShortPathFromFullPath(fileName),
						),
					);
				}

				resolve(object);
			}
		});
	});
}

/**
 * Returns the parsed content of a JSON file.
 * @param {string} fileName - path to a json file
 * @returns {Promise<object>} the parsed content of the given file
 */
async function getParsedJsonFileContent(fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, "utf8", (err, result) => {
			if (err) {
				reject(err);
			} else {
				let json = {};

				try {
					json = JSON.parse(result);
				} catch (err) {
					log("error", err.toString(), err);
				}

				resolve(json);
			}
		});
	});
}

/**
 * Returns the as HTML rendered content of markdown files.
 * @param {string} fileName - path to a markdown file
 * @returns {Promise<string>} the markdown of the given file converted into HTML
 */
async function getConvertedMarkdownFileContent(fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, "utf8", (err, result) => {
			if (err) {
				reject(err);
			} else {
				let string = "";

				try {
					string = Markdown.parse(result);
				} catch (err) {
					log("error", err.toString(), err);
				}

				resolve(string);
			}
		});
	});
}

/**
 * Calls different functions getting the file's content based on its type
 * and returns the (converted) file content.
 * @param {string} fileName - path to a file of any type
 * @returns {Promise<string|object|Array>} content of the given file based on its type
 */
export const readFile = async function (fileName) {
	return new Promise((resolve, reject) => {
		if ([".yaml", ".yml"].includes(path.extname(fileName))) {
			getYamlFileContent(fileName)
				.then((result) => resolve(result))
				.catch((err) => {
					log("error", err.toString(), err);
					reject();
				});
		} else if (helpers.fileIsDocumentationFile(fileName)) {
			getConvertedMarkdownFileContent(fileName)
				.then((result) => resolve(result))
				.catch((err) => {
					log("error", err.toString(), err);
					reject();
				});
		} else if (
			helpers.fileIsDataFile(fileName) &&
			[".js", ".cjs"].includes(path.extname(fileName))
		) {
			getJsFileContent(fileName)
				.then((result) => resolve(result))
				.catch((err) => {
					log("error", err.toString(), err);
					reject();
				});
		} else if (fileName.endsWith(".json")) {
			getParsedJsonFileContent(fileName)
				.then((result) => resolve(result))
				.catch((err) => {
					log("error", err.toString(), err);
					reject();
				});
		} else {
			fs.readFile(fileName, { encoding: "utf8" }, (err, result) => {
				if (err) {
					log("error", err.toString(), err);
					reject();
				} else {
					resolve(result);
				}
			});
		}
	});
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
	const promises = [];
	const paths = await getFilePaths(sourceTree);

	if (paths) {
		for (const fullPath of paths) {
			promises.push(
				new Promise((res, rej) => {
					readFile(fullPath.replace(/\0/g, ""))
						.then((data) => {
							fileContents[fullPath] = data;
							res();
						})
						.catch((err) => {
							rej(err);
						});
				}),
			);
		}
		return Promise.all(promises)
			.then(() => {
				return fileContents;
			})
			.catch((err) => console.error(err));
	}

	return {};
};
