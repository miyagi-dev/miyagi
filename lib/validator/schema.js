const AJV = require("ajv");
const path = require("path");
const helpers = require("../helpers.js");
const log = require("../logger.js");
const config = require("../config.json");

module.exports = function validateSchema(app, file, dataArray) {
  const jsonSchemaValidator = new AJV();
  const componentSchema = app.get("state").fileContents[
    helpers.getFullPathFromShortPath(
      app,
      helpers.getSchemaPathFromTemplatePath(app, file)
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
          `${path.dirname(file)}#${entry.name}: ${
            config.messages.schemaValidator.invalid
          }`
        );
      }

      validity.push(valid);
    }

    return validity;
  }
  log(
    "warn",
    `${path.dirname(file)}: ${config.messages.schemaValidator.noSchemaFound}`
  );

  return null;
};
