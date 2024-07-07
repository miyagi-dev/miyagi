const v8 = require("v8");
const path = require("path");

/**
 * Module for globally used helper functions
 * @module helpers
 */
module.exports = {
	/**
	 * Removes all keys starting with $ from an object
	 * @param {object} [obj] the object whose keys with $ should be removed
	 * @returns {object} the modified object
	 */
	removeInternalKeys: function (obj = {}) {
		const o = {};

		for (const [key, value] of Object.entries(obj)) {
			if (!key.startsWith("$") || key === "$ref" || key === "$opts") {
				o[key] = value;
			}
		}

		return o;
	},

	/**
	 * Returns everything after the last "." of a file extension (e.g. `html.twig` -> `twig`)
	 * @param {string} [extension] - File extension like `twig` or `html.twig`
	 * @returns {string} the last part of a the file extension
	 */
	getSingleFileExtension: function (extension = "") {
		return extension.slice(extension.lastIndexOf(".") + 1);
	},

	/**
	 * Normalizes a string be replacing whitespace, underscore, / etc with - and lowercases it
	 * @param {string} [str] string that should be normalized
	 * @returns {string} the normalized string
	 */
	normalizeString: function (str = "") {
		if (typeof str === "string") {
			return str
				.replace(/[^\w\s]/gi, "-")
				.replace(/_/g, "-")
				.replace(/ /g, "-")
				.toLowerCase();
		}

		return str;
	},

	/**
	 * If "<component>"" is set as the file name in the config, it returns the given file name, otherwise it returns the value from the config
	 * @param {string} nameInConfig - The defined name for a file in the config
	 * @param {string} fileName - The actual file name
	 * @returns {string} the filename based on the configuration file
	 */
	getResolvedFileName: function (nameInConfig, fileName) {
		if (nameInConfig === "<component>") {
			return fileName;
		}

		return nameInConfig;
	},

	/**
	 * Creates a deep clone of a object using internal v8 methods
	 * @param {object} obj - the object to clone
	 * @returns {object} clone of rhe given object
	 */
	cloneDeep: function (obj) {
		return v8.deserialize(v8.serialize(obj));
	},

	/**
	 * Accepts a path relative from the config.components.folder and returns the complete path based on the file system
	 * @param {string} shortPath - a relative file path based from the components folder
	 * @returns {string} absolute file path
	 */
	getFullPathFromShortPath: function (shortPath) {
		return path.join(
			process.cwd(),
			`${global.config.components.folder}/${shortPath}`
		);
	},

	/**
	 * Accepts an absolute (file system based) path and returns the short path relative from config.components.folder
	 * @param {string} fullPath - absolute file path
	 * @returns {string} relative file path based from the components folder
	 */
	getShortPathFromFullPath: function (fullPath) {
		return fullPath.replace(
			`${path.join(process.cwd(), global.config.components.folder)}/`,
			""
		);
	},

	/**
	 * Accepts a file path and checks if it is a mock file
	 * @param {string} filePath - path to any type of file
	 * @returns {boolean} is true if the given file is a mock file
	 */
	fileIsDataFile: function (filePath) {
		const extension = path.extname(filePath);

		if (!["js", "json", "yaml", "yml"].includes(extension.slice(1)))
			return false;

		const basename = path.basename(filePath, extension);
		if (["data", global.config.files.mocks.name].includes(basename))
			return true;

		return false;
	},

	/**
	 * Accepts a file path and checks if it is a documentation file
	 * @param {string} filePath - path to any type of file
	 * @returns {boolean} is true if the given file is a doc file
	 */
	fileIsDocumentationFile: function (filePath) {
		return path.extname(filePath) === ".md";
	},

	/**
	 * Accepts a file path and checks if it is a schema file
	 * @param {string} filePath - path to any type of file
	 * @returns {boolean} is true if the given file is a schema file
	 */
	fileIsSchemaFile: function (filePath) {
		return (
			path.basename(filePath) ===
			`${global.config.files.schema.name}.${global.config.files.schema.extension}`
		);
	},

	/**
	 * Accepts a file path and checks if it is component js or css file
	 * @param {string} filePath - path to any type of file
	 * @returns {boolean} is true if the given file is a css or js file
	 */
	fileIsAssetFile: function (filePath) {
		return (
			path.basename(filePath) ===
				`${module.exports.getResolvedFileName(
					global.config.files.css.name,
					path.basename(filePath, `.${global.config.files.css.extension}`)
				)}.${global.config.files.css.extension}` ||
			path.basename(filePath) ===
				`${module.exports.getResolvedFileName(
					global.config.files.js.name,
					path.basename(filePath, `.${global.config.files.js.extension}`)
				)}.${global.config.files.js.extension}`
		);
	},

	/**
	 * Accepts a file path and returns checks if it is a template file
	 * @param {string} filePath - path to any type of file
	 * @returns {boolean} is true if the given file is a template file
	 */
	fileIsTemplateFile: function (filePath) {
		return (
			path.basename(filePath) ===
			`${module.exports.getResolvedFileName(
				global.config.files.templates.name,
				path.basename(filePath, `.${global.config.files.templates.extension}`)
			)}.${global.config.files.templates.extension}`
		);
	},

	docFileIsIndexFile(fileName) {
		const baseName = path.basename(fileName);
		const extname = path.extname(fileName);

		if (extname !== ".md") return false;
		if (baseName === "README.md") return true;
		if (baseName === "index.md") return true;

		const dirParts = path.dirname(fileName).split(path.sep);
		if (dirParts[dirParts.length - 1] === path.basename(fileName, ".md"))
			return true;

		return false;
	},
};
