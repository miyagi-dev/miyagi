const getPartials = require("./state/partials.js");
const { getData } = require("./state/data.js");
const { getStructure } = require("./state/menu/index.js");
const getSourceTree = require("./state/sourceTree.js");

async function setState(app, methods, cb) {
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

  if (methods.sourceTree) {
    if (app.get("state") && app.get("state").sourceTree) {
      delete app.get("state").sourceTree;
    }

    app.set(
      "state",
      Object.assign({}, app.get("state"), {
        sourceTree: getSourceTree(app)
      })
    );
  }

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

  cb();
}

module.exports = setState;
