import jsYaml from "js-yaml";
import deepMerge from "deepmerge";
import log from "../logger.js";
import { t } from "../i18n/index.js";

/**
 * Module for validating mock data against JSON schema
 * @module validatorSchema
 * @param {object} component
 * @param {Array} dataArray - an array with mock data
 * @param {boolean} [noCli]
 * @returns {null|object[]} null if there is no schema or an array with booleans defining the validity of the entries in the data array
 */
export default function validateMockData(component, dataArray, noCli) {
	const componentSchema =
		global.state.fileContents[component.paths.schema.full];

	if (componentSchema) {
		const schemas = [];

		Object.entries(global.state.fileContents).forEach(([key, value]) => {
			if (
				key.endsWith(
					`${global.config.files.schema.name}.${global.config.files.schema.extension}`,
				)
			) {
				if (value && componentSchema.$id !== value.$id) {
					schemas.push(value);
				}
			}
		});

		const validity = [];
		let validate;
		let jsonSchemaValidator;

		try {
			jsonSchemaValidator = new global.config.schema.ajv(
				deepMerge(
					{
						allErrors: true,
						schemas: schemas.map((schema, i) => {
							if (!schema.$id) {
								schema.$id = i.toString();
							}
							return schema;
						}),
					},
					global.config.schema.options || {},
				),
			);
			validate = jsonSchemaValidator.compile(componentSchema);
		} catch (e) {
			const message = e.toString();
			if (!noCli) {
				log("error", `${component.paths.dir.short}:\n${message}`, e);
			}
			return [
				{
					type: "schema",
					data: [{ message }],
				},
			];
		}

		if (validate && dataArray) {
			dataArray.forEach((entry) => {
				const valid = validate(entry?.resolved ?? {});
				if (!valid && !noCli) {
					validate.errors.forEach((error) => {
						log(
							"error",
							`${component.paths.dir.short} # ${entry.name}\n${jsYaml.dump(error)}`,
						);
					});
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
			`${component.paths.dir.short}: ${t("validator.mocks.noSchemaFound")}`,
		);
	}

	return null;
}
