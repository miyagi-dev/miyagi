const schemaFaker = require("@stoplight/json-schema-sampler");
const jsYaml = require("js-yaml");
const fs = require("fs");
const log = require("../logger.js");
const { messages } = require("../config.json");

/**
 * Module for creating dummy mock data based on JSON schema
 *
 * @module generatorMocks
 * @param {string} folderPath - the path for the component that should be created
 * @param {object} filesConfig - the files configuration from the user configuration object
 */
module.exports = async function mockGenerator(folderPath, filesConfig) {
	if (!folderPath) {
		log("error", messages.dataGenerator.noComponentFolderDefined);

		return;
	}

	log(
		"info",
		messages.dataGenerator.starting.replace("{{fileName}}", folderPath)
	);

	const mockFilePath = `${folderPath}/${filesConfig.mocks.name}.${filesConfig.mocks.extension[0]}`;
	const schemaFilePath = `${folderPath}/${filesConfig.schema.name}.${filesConfig.schema.extension}`;

	return new Promise((resolve, reject) => {
		readFile(schemaFilePath, filesConfig)
			.then((result) => {
				try {
					const content = getContent(filesConfig.mocks.extension[0], result);

					readFile(mockFilePath, filesConfig)
						.then((res) => {
							if (res === "") {
								createFile(content, mockFilePath).then(resolve).catch(reject);
							} else {
								log(
									"error",
									messages.dataGenerator.dataFileExists.replace(
										"{{fileName}}",
										mockFilePath
									)
								);
								reject();
							}
						})
						.catch(() => {
							createFile(content, mockFilePath).then(resolve).catch(reject);
						});
				} catch (e) {
					log(
						"error",
						messages.dataGenerator.schemaFileCantBeParsed.replace(
							"{{fileName}}",
							schemaFilePath
						)
					);
					reject();
				}
			})
			.catch(() => {
				log(
					"error",
					messages.dataGenerator.noSchemaFile.replace(
						"{{fileName}}",
						schemaFilePath
					)
				);
				reject();
			});
	});
};

/**
 * Returns the dummy mock data in the correct format
 *
 * @param {string} fileType - the file type of the mock data that should be created
 * @param {object} schema - the JSON schema object
 * @returns {string} the dummy mock data
 */
function getContent(fileType, schema) {
	let content;
	const data = schemaFaker.sample(schema);

	switch (fileType) {
		case "yaml":
		case "yml":
			content = jsYaml.dump(data);
			break;
		case "json":
			content = JSON.stringify(data, null, 2);
			break;
		case "js":
			content = `module.exports = ${JSON.stringify(data, null, 2)}
      `;
			break;
		default:
			content = "";
	}

	return content;
}

/**
 * Creates the mock file with the dummy mock data
 *
 * @param {string} content - the content for the mock file
 * @param {string} mockFilePath - the path to the mock file
 */
function createFile(content, mockFilePath) {
	return new Promise((resolve, reject) => {
		fs.writeFile(mockFilePath, content, (err) => {
			if (err) {
				log("error", err);
				reject();
			} else {
				log("success", messages.generator.done);
				resolve();
			}
		});
	});
}

/**
 * Reads the content of a given file
 *
 * @param {string} filePath - path to a file that should be read
 * @param {object} filesConfig
 * @returns {Promise} gets resolved when the file has been read
 */
function readFile(filePath, filesConfig) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, "utf8", (err, result) => {
			if (err) {
				reject(err);
			} else {
				if (["yaml", "yml"].includes(filesConfig.schema.extension)) {
					resolve(jsYaml.load(result));
				} else {
					resolve(JSON.parse(result));
				}
			}
		});
	});
}
