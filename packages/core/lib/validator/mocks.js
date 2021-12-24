import AJV from "ajv";
import deepMerge from "deepmerge";
import path from "path";
import {
  getFullPathFromShortPath,
  getSchemaPathFromTemplatePath,
} from "../helpers.js";
import log from "../logger.js";
import { messages } from "../miyagi-config.js";

/**
 * Module for validating mock data against JSON schema
 *
 * @module validatorSchema
 * @param {object} app - the express instance
 * @param {string} filePath - the path to a template file
 * @param {Array} dataArray - an array with mock data
 * @returns {null|boolean[]} null if there is no schema or an array with booleans defining the validity of the entries in the data array
 */
export default function validateMockData(app, filePath, dataArray) {
  const componentSchema =
    app.get("state").fileContents[
      getFullPathFromShortPath(
        app,
        getSchemaPathFromTemplatePath(app, filePath)
      )
    ];

  if (componentSchema) {
    const schemas = [];
    Object.entries(app.get("state").fileContents).forEach(([key, value]) => {
      if (
        key.endsWith(
          `${app.get("config").files.schema.name}.${
            app.get("config").files.schema.extension
          }`
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
          app.get("config").schema
        )
      );
      validate = jsonSchemaValidator.compile(componentSchema);
    } catch (e) {
      const msg = e.toString();
      log("error", `${path.dirname(filePath)}: ${msg}`);
      return msg;
    }

    if (validate) {
      dataArray.forEach((entry) => {
        const valid = validate(entry.data || {});

        if (!valid) {
          log(
            "error",
            `${path.dirname(filePath)}#${entry.name}: ${
              messages.validator.mocks.invalid
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
      `${path.dirname(filePath)}: ${messages.validator.mocks.noSchemaFound}`
    );
  }

  return null;
}
