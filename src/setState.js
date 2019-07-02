const getPartials = require("./state/partials.js");
const { getData } = require("./state/data.js");
const { getStructure } = require("./state/menu/index.js");

async function setState(app, methods, cb) {
  if (methods.menu) {
    if (app.get("state") && app.get("state").menu) {
      delete app.get("state").menu;
    }

    app.set(
      "state",
      Object.assign({}, app.get("state"), {
        menu: await getStructure(app)
      })
    );
  }

  if (methods.partials) {
    if (app.get("state") && app.get("state").partials) {
      delete app.get("state").partials;
    }

    app.set(
      "state",
      Object.assign({}, app.get("state"), {
        partials: getPartials(app)
      })
    );
  }

  if (methods.data) {
    if (app.get("state") && app.get("state").data) {
      delete app.get("state").data;
    }

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
