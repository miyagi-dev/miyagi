const getPartials = require("./state/partials.js");
const { getData } = require("./state/data.js");
const { getStructure } = require("./state/menu/index.js");

async function setState(app, methods, cb) {
  if (methods.menu) {
    app.set(
      "state",
      Object.assign({}, app.get("state"), {
        menu: await getStructure(app)
      })
    );
  }

  if (methods.partials) {
    app.set(
      "state",
      Object.assign({}, app.get("state"), {
        partials: getPartials(app)
      })
    );
  }

  if (methods.data) {
    app.set(
      "state",
      Object.assign({}, app.get("state"), {
        data: await getData(app)
      })
    );
  }

  cb();
}

module.exports = setState;
