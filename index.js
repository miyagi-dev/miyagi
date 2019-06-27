const config = require("./src/config.json");
const fs = require("fs");
const init = require("./src/init.js");

fs.readFile(`./${config.userConfigFile}`, "utf8", (err, result) => {
  if (result) {
    const cnf = JSON.parse(result);

    if (!cnf.extension) {
      console.error(config.messages.missingFileExtension);
    } else if (!cnf.srcFolder) {
      console.error(config.messages.missingComponentLocation);
    } else if (!cnf.engine) {
      console.error(config.messages.missingEngine);
    } else {
      init.start(cnf);
    }
  } else {
    console.error(config.messages.roundupJsonNotFound);
  }
});
