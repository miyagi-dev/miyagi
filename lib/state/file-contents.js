/**
 * Module for getting the content of all relevant files
 *
 * @module stateFilecontents
 */

const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const Markdown = require("marked");
const { promisify } = require("util");
const config = require("../config.json");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const stateHelpers = require("./helpers.js");

const readFileAsync = promisify(fs.readFile);

/**
 * Makes sure a requiring a module does not return a cached version
 *
 * @param {string} module - cjs module name
 * @returns {object} the required cjs module
 */
function requireUncached(module) {
	delete require.cache[require.resolve(module)];
	return require(module);
}

/**
 * Checks if a given array of file paths includes a given file path
 *
 * @param {string} file - file path string
 * @param {Array} fileNames - array of file path string
 * @returns {boolean} is true if given array includes given file path
 */
function checkIfFileNamesIncludeFile(file, fileNames) {
	return fileNames.includes(path.basename(file));
}

/**
 * Returns all component and docs file from components.folder
 *
 * @returns {Promise<string[]>} an array of file paths
 */
async function getFilePaths() {
	const { components, docs, files } = global.config;

	return [
		...(await stateHelpers.getFiles(
			components.folder,
			components.ignores,
			function (res) {
				if (
					checkIfFileNamesIncludeFile(res, [
						`${helpers.getResolvedFileName(
							files.templates.name,
							path.basename(res, `.${files.templates.extension}`)
						)}.${files.templates.extension}`,
						`${files.mocks.name}.${files.mocks.extension[0]}`,
						`${files.mocks.name}.${files.mocks.extension[1]}`,
						`${files.schema.name}.${files.schema.extension}`,
						`data.${files.mocks.extension[0]}`,
						`data.${files.mocks.extension[1]}`,
					]) ||
					helpers.fileIsDocumentationFile(res)
				) {
					return res;
				} else {
					return null;
				}
			}
		)),
		...(docs.folder
			? await stateHelpers.getFiles(docs.folder, [], function (res) {
					if (helpers.fileIsDocumentationFile(res)) {
						return res;
					} else {
						return null;
					}
			  })
			: []),
	];
}

/**
 * Calls the export function of a CJS module and returns its return value
 * or returns the return value directly if it is not a function
 *
 * @param {string} fileName - file path string
 * @returns {Promise<string>} - the default export of the cjs module or - if the default export is a function - its return value
 */
async function getJsFileContent(fileName) {
	const file = requireUncached(path.resolve(fileName));

	return typeof file === "function" ? file() : file;
}

/**
 * Returns the content of a YAML file parsed as JSON object
 *
 * @param {string} fileName - path to a yaml file
 * @returns {object} the content of the given file as an object
 */
function getYamlFileContent(fileName) {
	let result;

	try {
		result = yaml.load(fs.readFileSync(fileName, "utf8"));
	} catch (e) {
		result = {};
		log(
			"warn",
			config.messages.jsonFileHasInvalidFormat.replace(
				"{{filePath}}",
				helpers.getShortPathFromFullPath(fileName)
			)
		);
	}

	return result;
}

/**
 * Returns the parsed content of a JSON file.
 *
 * @param {string} fileName - path to a json file
 * @returns {Promise<object>} the parsed content of the given file
 */
async function getParsedJsonFileContent(fileName) {
	let result;

	try {
		result = await readFileAsync(fileName, "utf8");

		try {
			result = JSON.parse(result);
		} catch (e) {
			result = {};
			log(
				"warn",
				config.messages.jsonFileHasInvalidFormat.replace(
					"{{filePath}}",
					helpers.getShortPathFromFullPath(fileName)
				)
			);
		}
	} catch (e) {
		result = {};
		log(
			"warn",
			config.messages.jsonFileHasInvalidFormat.replace(
				"{{filePath}}",
				helpers.getShortPathFromFullPath(fileName)
			)
		);
	}

	return result;
}

/**
 * Returns the as HTML rendered content of markdown files.
 *
 * @param {string} fileName - path to a markdown file
 * @returns {Promise<string>} the markdown of the given file converted into HTML
 */
async function getConvertedMarkdownFileContent(fileName) {
	let result;

	try {
		result = await readFileAsync(fileName, "utf8");

		try {
			result = Markdown.parse(result);
		} catch (e) {
			result = "";
		}
	} catch (e) {
		result = "";
	}

	return result;
}

/**
 * Calls different functions getting the file's content based on its type
 * and returns the (converted) file content.
 *
 * @param {string} fileName - path to a file of any type
 * @returns {Promise<string|object|Array>} content of the given file based on its type
 */
async function readFile(fileName) {
	let result;

	if (helpers.fileIsTemplateFile(fileName)) {
		result = fs.readFileSync(fileName, { encoding: "utf8" });
	} else if ([".yaml", ".yml"].includes(path.extname(fileName))) {
		result = getYamlFileContent(fileName);
	} else if (helpers.fileIsDocumentationFile(fileName)) {
		result = getConvertedMarkdownFileContent(fileName);
	} else if (
		helpers.fileIsDataFile(fileName) &&
		[".js", ".cjs"].includes(path.extname(fileName))
	) {
		result = await getJsFileContent(fileName);
	} else {
		result = getParsedJsonFileContent(fileName);
	}

	return result;
}

/**
 * Returns a promise which will be resolved with an object,
 * including all component files (except for template files)
 * and their content.
 *
 * @returns {Promise} gets resolved with the content of all docs, mocks, schema files
 */
async function getFileContents() {
	const fileContents = {};
	const promises = [];
	const paths = await getFilePaths();

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
							console.error(err);
							rej();
						});
				})
			);
		}
		return Promise.all(promises)
			.then(() => {
				return fileContents;
			})
			.catch((err) => console.error(err));
	}

	return {};
}

module.exports = {
	readFile,
	getFileContents,
};
