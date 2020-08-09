const AJV = require("ajv");
const deepMerge = require("deepmerge");
const path = require("path");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const config = require("../config.json");

/**
 * Module for validating mock data against JSON schema
 *
 * @module validatorSchema
 * @param {object} app - the express instance
 * @param {string} filePath - the path to a template file
 * @param {Array} dataArray - an array with mock data
 * @returns {null|boolean[]} null if there is no schema or an array with booleans defining the validity of the entries in the data array
 */
module.exports = function validateSchema(app, filePath, dataArray) {
  const componentSchema = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(
      app,
      helpers.getSchemaPathFromTemplatePath(app, filePath)
    )
  ];

  if (componentSchema) {
    const schemas = Object.entries(app.get("state").fileContents)
      .filter(([key]) =>
        key.endsWith(
          `${app.get("config").files.schema.name}.${
            app.get("config").files.schema.extension
          }`
        )
      )
      .map((schema) => schema[1]);

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
          app.get("config").schema
        )
      );
      validate = jsonSchemaValidator.compile(componentSchema);
    } catch (e) {
      const msg = e.toString();
      log("error", msg);
      return msg;
    }

    if (validate) {
      dataArray.forEach((entry) => {
        const valid = validate(entry.data || {});

        if (!valid) {
          log(
            "error",
            `${path.dirname(filePath)}#${entry.name}: ${
              config.messages.schemaValidator.invalid
            }`
          );
        }

        validity.push(valid);
      });
    }

    return validity;
  }

  if (!app.get("config").isBuild) {
    log(
      "warn",
      `${path.dirname(filePath)}: ${
        config.messages.schemaValidator.noSchemaFound
      }`
    );
  }

  return null;
};
