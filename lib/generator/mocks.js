import { readFile, writeFile } from "node:fs/promises";
import schemaFaker from "@stoplight/json-schema-sampler";
import jsYaml from "js-yaml";
import path from "path";
import log from "../logger.js";
import { t } from "../i18n/index.js";

/**
 * Module for creating dummy mock data based on JSON schema
 * @module generatorMocks
 * @param {string} folderPath - the path for the component that should be created
 * @param {object} filesConfig - the files configuration from the user configuration object
 * @returns {Promise<{success, message?}>}
 */
export default async function mockGenerator(folderPath, filesConfig) {
	if (!folderPath) {
		return {
			success: false,
			message: {
				type: "error",
				text: t("dataGenerator.noComponentFolderDefined"),
			},
		};
	}

	log("info", t("dataGenerator.starting").replace("{{fileName}}", folderPath));

	const mockFilePath = `${path.join(folderPath, filesConfig.mocks.name)}.${
		filesConfig.mocks.extension[0]
	}`;
	const schemaFilePath = `${path.join(folderPath, filesConfig.schema.name)}.${
		filesConfig.schema.extension
	}`;

	const {
		status,
		data: schemaData,
		message,
	} = await readAndParseFile(schemaFilePath, filesConfig);

	if (status === "success") {
		try {
			const content = getContent(filesConfig.mocks.extension[0], schemaData);

			const { status, data } = await readAndParseFile(
				mockFilePath,
				filesConfig,
			);

			if (status === "success") {
				if (data === "") {
					const { status, message } = await createFile(content, mockFilePath);

					if (status === "error") {
						return {
							success: false,
							message: {
								type: "error",
								text: message,
							},
						};
					} else {
						return {
							success: true,
						};
					}
				} else {
					return {
						success: false,
						message: {
							type: "error",
							text: t("dataGenerator.dataFileExists").replace(
								"{{fileName}}",
								mockFilePath,
							),
						},
					};
				}
			} else {
				const { status, message } = await createFile(content, mockFilePath);

				if (status === "error") {
					return {
						success: false,
						message: {
							type: "error",
							text: message,
						},
					};
				} else {
					return {
						success: true,
					};
				}
			}
			// eslint-disable-next-line no-unused-vars
		} catch (e) {
			return {
				success: false,
				message: {
					type: "error",
					text: t("dataGenerator.schemaFileCantBeParsed").replace(
						"{{fileName}}",
						schemaFilePath,
					),
				},
			};
		}
	} else {
		return {
			success: false,
			message: {
				type: "error",
				text: t("dataGenerator.noSchemaFile").replace(
					"{{fileName}}",
					schemaFilePath,
				),
				verbose: message,
			},
		};
	}
}

/**
 * Returns the dummy mock data in the correct format
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
 * @param {string} content - the content for the mock file
 * @param {string} mockFilePath - the path to the mock file
 * @returns {Promise<object>}
 */
async function createFile(content, mockFilePath) {
	try {
		await writeFile(mockFilePath, content);
		return {
			status: "success",
			message: t("generator.done"),
		};
	} catch (err) {
		return {
			status: "error",
			message: err.message,
		};
	}
}

/**
 * Reads the content of a given file
 * @param {string} filePath - path to a file that should be read
 * @param {object} filesConfig
 * @returns {Promise<object>}
 */
async function readAndParseFile(filePath, filesConfig) {
	try {
		const result = await readFile(filePath, "utf8");
		let data;

		if (["yaml", "yml"].includes(filesConfig.schema.extension)) {
			data = jsYaml.load(result);
		} else {
			data = JSON.parse(result);
		}

		return {
			status: "success",
			data,
		};
	} catch (err) {
		return {
			status: "error",
			message: err.message,
		};
	}
}
