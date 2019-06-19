const fs = require("fs");
const init = require("./src/init.js");

let config;

try {
  config = JSON.parse(fs.readFileSync("./styleguide.json", "utf8"));
} catch (error) {
  config = {};
} finally {
  if (!config.extension) {
    console.error(
      "Please specify the file extension of your components in styleguide.json (key: 'extension', type: String)"
    );
  } else if (!config.srcFolder) {
    console.error(
      "Please specify the location of your components in styleguide.json (key: 'srcFolder', type: String)"
    );
  } else {
    init(config);
  }
}
