/**
 * Module for registering the views in express
 *
 * @module initViews
 */

import path from "path";
import config from "../miyagi-config.js";
import __dirname from "../__dirname.js";

export default function initViews(app) {
  app.set("views", [
    path.join(__dirname, `../${config.folders.views}`),
    path.resolve(app.get("config").components.folder),
  ]);
}
