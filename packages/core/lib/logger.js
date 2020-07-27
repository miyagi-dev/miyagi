/**
 * Module for pretty cli logs
 *
 * @module logger
 * @param {string} [type] - Can be any of "error", "warn" or "success"
 * @param {string} message
 */

const chalk = require("chalk");

module.exports = function log(type, message) {
  const date = new Date();
  const dateStr = `${date.getFullYear()}/${date
    .getMonth()
    .toString()
    .padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")} ${date.getHours()}:${date.getMinutes()}`;

  if (type === "error") {
    console.error(`${chalk.grey(dateStr)} ${chalk.red("Error:")} ${message}`);
  } else if (type === "warn") {
    console.info(
      `${chalk.grey(dateStr)} ${chalk.yellow("Warning:")} ${message}`
    );
  } else if (type === "success") {
    console.info(
      `${chalk.grey(dateStr)} ${chalk.green("Success:")} ${message}`
    );
  } else {
    console.info(`${chalk.grey(dateStr)} ${chalk.cyan("Info:")} ${message}`);
  }
};
