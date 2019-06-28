const config = require("./src/config.json");
const fs = require("fs");
const init = require("./src/init.js");
const logger = require("./src/logger.js");

fs.readFile(`./${config.userConfigFile}`, "utf8", (err, result) => {
  if (result) {
    let cnf;

    try {
      cnf = JSON.parse(result);
    } catch (e) {
      cnf = {};
    } finally {
      if (!cnf.extension) {
        logger.log("error", config.messages.missingExtension);
      } else if (!cnf.srcFolder) {
        logger.log("error", config.messages.missingSrcFolder);
      } else if (!cnf.engine) {
        logger.log("error", config.messages.missingEngine);
      } else {
        init.start(cnf);
      }
    }
  } else {
    logger.log("error", config.messages.roundupJsonNotFound);
  }
});
