/**
 * Module for registering handlebars view helpers
 *
 * @module initViewhelpers
 */

import handlebars from "handlebars";
import { render as renderMenu } from "../render/menu/index.js";

/**
 * Returns the menu html
 *
 * @param {object[]} children - all items in the menu
 * @param {string} path - the requested component
 * @param {string} variation - the requested variation
 * @returns {string} the menu html
 */
function getMenuHtml(children, path, variation) {
  return renderMenu(this, children, { path, variation }, 0);
}

/**
 * Renders all link tags for given stylesheet files
 *
 * @param {string[]} files - the paths to CSS files
 * @returns {string} the html with link tags
 */
function getCssFilesHtml(files) {
  let html = "";

  for (let file of files) {
    html += `<link rel="stylesheet" href="${file}">\n`;
  }

  return html;
}

/**
 * Renders all script tags for given javascript files
 *
 * @param {string[]} files - the paths to JS files
 * @returns {string} the html with script tags
 */
function getJsFilesHtml(files) {
  let html = "";

  for (let file of files) {
    const typeStr = file.type ? ` type="${file.type}"` : "";
    const deferStr = file.defer ? `defer` : "";
    const asyncStr = file.async ? `async` : "";
    html += `
    <script src="${file.src}"${typeStr + deferStr + asyncStr}></script>
    `.trim();
  }

  return html;
}

export default function initViewHelpers(app) {
  const { assets } = app.get("config");

  handlebars.registerHelper("menu", getMenuHtml.bind(app));
  handlebars.registerHelper("cssFiles", getCssFilesHtml.call(null, assets.css));

  handlebars.registerHelper(
    "jsFilesHead",
    getJsFilesHtml.call(
      null,
      assets.js.filter((entry) => entry.position === "head")
    )
  );
  handlebars.registerHelper(
    "jsFilesBody",
    getJsFilesHtml.call(
      null,
      assets.js.filter((entry) => entry.position === "body")
    )
  );
  handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
}
