const ajv = require("ajv");
const path = require("path");
const helpers = require("../helpers.js");
const logger = require("../logger.js");
const config = require("../config.json");

module.exports = function(app, file, dataArray) {
  const jsonSchemaValidator = new ajv();
  const componentSchema = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(
      app,
      helpers.getSchemaPathFromTemplatePath(app, file)
    )
  ];

  if (componentSchema) {
    const validate = jsonSchemaValidator.compile(componentSchema);
    const validity = [];

    dataArray.forEach(function(entry) {
      const valid = validate(entry.data);

      if (!valid) {
        logger.log(
          "error",
          `${path.dirname(file)}#${entry.name}: ${
            config.messages.schemaValidator.invalid
          }`
        );
      }

      validity.push(valid);
    });

    return validity;
  } else {
    logger.log(
      "warn",
      `${path.dirname(file)}: ${config.messages.schemaValidator.noSchemaFound}`
    );

    return null;
  }
};
