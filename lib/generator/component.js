const path = require("path");
const fs = require("fs");
const jsonToYaml = require("js-yaml");
const helpers = require("../helpers.js");
const { t } = require("../i18n");

/**
 * Module for creating component files based on the configuration cli params
 * @param {object} root
 * @param {object} root.component
 * @param {Array} root.fileTypes
 */
module.exports = async function componentGenerator({ component, fileTypes }) {
	return new Promise((resolve, reject) => {
		createComponentFolder(component)
			.then(async () => {
				await createComponentFiles(
					global.config.files,
					component,
					fileTypes,
					global.config.components.folder
				);
				resolve(
					t("generator.component.done").replace("{{component}}", component)
				);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

/**
 * Returns an array with file names
 * @param {object} fileNames - an object with file names for the component
 * @param {Array} fileTypes
 * @returns {Array} all file paths that should be created
 */
function getFiles(fileNames, fileTypes) {
	return fileTypes.map((fileType) => fileNames[fileType]);
}

/**
 * Returns the dummy content for a component file
 * @param {string} fileType - the file type that should be created
 * @param {object} filesConfig - the files object from the user congiguration object
 * @param {string} componentPath
 * @returns {string} dummy file content based on the given file type
 */
function getDummyFileContent(fileType, filesConfig, componentPath) {
	let str;

	switch (fileType) {
		case "mocks":
			{
				const data = {
					$variants: [
						{
							$name: "",
						},
					],
				};

				if (["yaml", "yml"].includes(filesConfig.mocks.extension[0])) {
					str = jsonToYaml.dump(data);
				} else {
					str = `${JSON.stringify(data, null, 2)}\n`;
				}
			}
			break;
		case "schema":
			{
				const id = path.join("/", componentPath);

				if (["yaml", "yml"].includes(filesConfig.schema.extension)) {
					str = `$schema: "http://json-schema.org/draft-07/schema"
$id: "${id}"
additionalProperties: false
properties:
required:
`;
				} else {
					str = `${JSON.stringify(
						{
							$schema: "http://json-schema.org/draft-07/schema",
							$id: id,
							additionalProperties: false,
							properties: {},
							required: [],
						},
						null,
						2
					)}\n`;
				}
			}
			break;
		default:
			str = "";
	}

	return str;
}

/**
 * Creates the component files
 * @param {object} filesConfig - the files configuration from the user configuration object
 * @param {string} componentPath - the path of the component folder
 * @param {Array} fileTypes
 * @param {string} componentFolder
 * @returns {Promise} gets resolved when all files have been created
 */
function createComponentFiles(
	filesConfig,
	componentPath,
	fileTypes,
	componentFolder
) {
	const componentName = path.basename(componentPath);
	const fileNames = getFileNames(filesConfig, componentName);
	const files = getFiles(fileNames, fileTypes);
	const entries = Object.entries(fileNames);
	const promises = [];

	for (const [type, file] of entries) {
		if (files.includes(file)) {
			promises.push(
				new Promise((resolve, reject) => {
					const fullFilePath = path.join(
						process.env.INIT_CWD || process.cwd(),
						componentPath,
						file
					);

					fs.writeFile(
						fullFilePath,
						getDummyFileContent(
							type,
							filesConfig,
							path.relative(componentFolder, componentPath)
						),
						{ flag: "wx" },
						function createComponentFilesCallback(err) {
							if (err) {
								reject(err.message);
							} else {
								resolve();
							}
						}
					);
				})
			);
		}
	}

	return Promise.all(promises);
}

/**
 * Returns an object with the file names for a given component name
 * @param {object} filesConfig - the files configuration from the user configuration object
 * @param {string} componentName - the name of the component
 * @returns {object} all file names based on the user configuration
 */
function getFileNames(filesConfig, componentName) {
	return {
		tpl: `${helpers.getResolvedFileName(
			filesConfig.templates.name,
			componentName
		)}.${filesConfig.templates.extension}`,
		mocks: `${filesConfig.mocks.name}.${filesConfig.mocks.extension[0]}`,
		docs: "README.md",
		css: `${helpers.getResolvedFileName(filesConfig.css.name, componentName)}.${
			filesConfig.css.extension
		}`,
		js: `${helpers.getResolvedFileName(filesConfig.js.name, componentName)}.${
			filesConfig.js.extension
		}`,
		schema: `${filesConfig.schema.name}.${filesConfig.schema.extension}`,
	};
}

/**
 * Creates the component folder
 * @param {string} folder - component folder path that should be created
 * @returns {Promise} gets resolved when the folder has been created
 */
function createComponentFolder(folder) {
	return new Promise((resolve, reject) => {
		fs.mkdir(
			/*
			 * When using `yarn/npm miyagi new …`, `process.env.INIT_CWD` equals
			 * the current working directory, so also subdirectories of where
			 * the package.json is located. In this case `process.cwd()` always
			 * equals the root directory though.
			 * When using node directly, `process.env.INIT_CWD` is not available,
			 * but `process.cwd()` is always the current working directory, so
			 * also subdirectories.
			 * So, if INIT_CWD is available, we know it is the directory the user
			 * cd'ed into, if it not available, then we use process.cwd(), which
			 * in that case is also the directory the user cd'ed into.
			 * It is important that we let the user create a component from their
			 * current working directory, so they can benefit from autocompletion.
			 */
			path.join(process.env.INIT_CWD || process.cwd(), folder),
			{ recursive: true },
			function createComponentCallback(err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
}
