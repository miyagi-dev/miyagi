"use strict";

const getPartials = require("../state/partials.js");
const { getData } = require("../state/data.js");
const { getMenu } = require("../state/menu/index.js");
const getSourceTree = require("../state/source-tree.js");

module.exports = async function(app, methods) {
  const promises = [];

  if (methods.data) {
    if (app.get("state") && app.get("state").data) {
      delete app.get("state").data;
    }

    promises.push(
      new Promise(async resolve => {
        const data = await getData(app);

        app.set(
          "state",
          Object.assign({}, app.get("state"), {
            data
          })
        );

        resolve(data);
      })
    );
  }

  if (methods.sourceTree) {
    if (app.get("state") && app.get("state").sourceTree) {
      delete app.get("state").sourceTree;
    }

    const sourceTree = getSourceTree(app);

    app.set(
      "state",
      Object.assign({}, app.get("state"), {
        sourceTree
      })
    );
  }

  if (methods.menu) {
    if (app.get("state") && app.get("state").menu) {
      delete app.get("state").menu;
    }

    promises.push(
      new Promise(async resolve => {
        const menu = await getMenu(app);

        app.set(
          "state",
          Object.assign({}, app.get("state"), {
            menu
          })
        );

        resolve(menu);
      })
    );
  }

  if (methods.partials) {
    if (app.get("state") && app.get("state").partials) {
      delete app.get("state").partials;
    }
    const partials = getPartials(app);

    app.set(
      "state",
      Object.assign({}, app.get("state"), {
        partials
      })
    );
  }

  return await Promise.all(promises).then(() => {
    return app.get("state");
  });
};
