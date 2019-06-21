const config = require("./src/config.json");
const fs = require("fs");
const init = require("./src/init.js");

let cnf;

try {
  cnf = JSON.parse(fs.readFileSync(`./${config.userConfigFile}`, "utf8"));
} catch (error) {
  cnf = {};
} finally {
  if (!cnf.extension) {
    console.error(config.messages.missingFileExtension);
  } else if (!cnf.srcFolder) {
    console.error(config.messages.missingComponentLocation);
  } else {
    init(cnf);
  }
}
