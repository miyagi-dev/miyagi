const getSourceStructure = require("./state/structure.js");
const getPartials = require("./state/partials.js");
const { getData } = require("./state/data.js");

async function setState(app, methods, cb) {
  if (methods.structure) {
    app.set(
      "state",
      Object.assign({}, app.get("state"), {
        srcStructure: getSourceStructure(app)
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
