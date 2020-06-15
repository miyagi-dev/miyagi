const AJV = require("ajv");
const path = require("path");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const config = require("../config.json");

/**
 * Module for validating mock data against JSON schema
 * @module validator/schema
 * @param {require('express').default} app
 * @param {string} filePath - the path to a template file
 * @param {Array} dataArray - an array with mock data
 */
module.exports = function validateSchema(app, filePath, dataArray) {
  const jsonSchemaValidator = new AJV();
  const componentSchema = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(
      app,
      helpers.getSchemaPathFromTemplatePath(app, filePath)
    )
  ];

  if (componentSchema) {
    const validate = jsonSchemaValidator.compile(componentSchema);
    const validity = [];

    for (const entry of dataArray) {
      const valid = validate(entry.data);

      if (!valid) {
        log(
          "error",
          `${path.dirname(filePath)}#${entry.name}: ${
            config.messages.schemaValidator.invalid
          }`
        );
      }

      validity.push(valid);
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
