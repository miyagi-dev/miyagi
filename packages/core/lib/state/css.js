import fs from "fs";
import css from "css";
import deepMerge from "deepmerge";
import path from "path";
import log from "../logger.js";
import { messages } from "../miyagi-config.js";

export default function getCSS(app) {
  const { assets } = app.get("config");

  if (assets?.customProperties?.files) {
    const promises = [];

    let cssObject = {};

    assets.customProperties.files.forEach((file) => {
      promises.push(
        new Promise((resolve) => {
          fs.readFile(
            path.join(assets.root, file),
            "utf-8",
            (err, response) => {
              if (err) {
                resolve({});
                log(
                  "warn",
                  messages.customPropertyFileNotFound.replace(
                    "{{filePath}}",
                    file
                  )
                );
              } else {
                resolve(css.parse(response));
              }
            }
          );
        })
      );
    });

    return Promise.all(promises).then((objects) => {
      objects.forEach((obj) => {
        cssObject = deepMerge(cssObject, obj);
      });

      return cssObject;
    });
  }

  return Promise.resolve(null);
}
