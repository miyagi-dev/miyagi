const chalk = require("chalk");

module.exports = function log(type, message) {
  if (type === "error") {
    console.error(`${chalk.red("Error:")} ${message}`);
  } else if (type === "warn") {
    console.info(`${chalk.yellow("Warning:")} ${message}`);
  } else if (type === "success") {
    console.info(`${chalk.green("Success:")} ${message}`);
  } else {
    console.info(`${chalk.cyan("Info:")} ${message}`);
  }
};
