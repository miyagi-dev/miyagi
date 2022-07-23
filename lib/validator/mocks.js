const AJV = require("ajv").default;
const deepMerge = require("deepmerge");
const path = require("path");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const config = require("../config.json");

/**
 * Module for validating mock data against JSON schema
 *
 * @module validatorSchema
 * @param {string} filePath - the path to a template file
 * @param {Array} dataArray - an array with mock data
 * @param {boolean} noCli
 * @returns {null|boolean[]} null if there is no schema or an array with booleans defining the validity of the entries in the data array
 */
module.exports = function validateMockData(filePath, dataArray, noCli) {
	const componentSchema =
		global.state.fileContents[
			helpers.getFullPathFromShortPath(
				helpers.getSchemaPathFromTemplatePath(filePath)
			)
		];

	if (componentSchema) {
		const schemas = [];
		Object.entries(global.state.fileContents).forEach(([key, value]) => {
			if (
				key.endsWith(
					`${global.config.files.schema.name}.${global.config.files.schema.extension}`
				)
			) {
				if (componentSchema.$id !== value.$id) {
					schemas.push(value);
				}
			}
		});

		const validity = [];
		let validate;
		let jsonSchemaValidator;

		try {
			jsonSchemaValidator = new AJV(
				deepMerge(
					{
						schemas: schemas.map((schema, i) => {
							if (!schema.$id) {
								schema.$id = i.toString();
							}
							return schema;
						}),
					},
					global.config.schema
				)
			);
			validate = jsonSchemaValidator.compile(componentSchema);
		} catch (e) {
			const message = e.toString();
			if (!noCli) {
				log("error", `${path.dirname(filePath)}:\n${message}`);
			}
			return [
				{
					type: "schema",
					data: [{ message }],
				},
			];
		}

		if (validate) {
			dataArray.forEach((entry) => {
				const valid = validate(entry.data || {});

				if (!valid && !noCli) {
					log(
						"error",
						`${path.dirname(filePath)} — ${
							entry.name
						}:\n${jsonSchemaValidator.errorsText(validate.errors)}`
					);
				}

				if (!valid) {
					validity.push({
						variant: entry.name,
						data: validate.errors,
					});
				}
			});
		}

		return validity.map((item) => ({
			type: "mocks",
			...item,
		}));
	}

	if (!global.config.isBuild && !noCli) {
		log(
			"warn",
			`${path.dirname(filePath)}: ${
				config.messages.validator.mocks.noSchemaFound
			}`
		);
	}

	return null;
};
