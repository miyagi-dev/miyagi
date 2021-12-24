/**
 * Module for pretty cli logs
 *
 * @module logger
 * @param {string} [type] - Can be any of "error", "warn" or "success"
 * @param {string} message
 */

import colors from "picocolors";

export default function log(type, message) {
  if (process.env.MIYAGI_JS_API) return;

  const date = new Date();
  const dateStr = `${date.getFullYear()}/${date
    .getMonth()
    .toString()
    .padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")} ${date.getHours()}:${date.getMinutes()}`;

  if (type === "error") {
    console.error(`${colors.gray(dateStr)} ${colors.red("Error:")} ${message}`);
  } else if (type === "warn") {
    console.info(
      `${colors.gray(dateStr)} ${colors.yellow("Warning:")} ${message}`
    );
  } else if (type === "success") {
    console.info(
      `${colors.gray(dateStr)} ${colors.green("Success:")} ${message}`
    );
  } else {
    console.info(`${colors.gray(dateStr)} ${colors.cyan("Info:")} ${message}`);
  }
}
