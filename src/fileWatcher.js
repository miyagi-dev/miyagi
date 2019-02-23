const chokidar = require("chokidar");
const setState = require("./setState.js");
const registerPartials = require("./hbs/registerPartials.js");

function fileWatcher(server, app, hbs) {
  const io = require("socket.io").listen(server);

  chokidar
    .watch(app.get("config").srcFolder, {
      ignoreInitial: true
    })
    .on("all", () => {
      io.emit("fileChanged");
      setState(app);
      registerPartials(app, hbs);
    });
}

module.exports = fileWatcher;
