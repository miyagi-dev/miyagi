"use strict";

const getPartials = require("./partials.js");
const { getData } = require("./data.js");
const { getMenu } = require("./menu/index.js");
const getSourceTree = require("./source-tree.js");

module.exports = async function(app, methods) {
  const promises = [];
  const state = app.get("state") || {};

  if (methods.data) {
    promises.push(
      new Promise(async resolve => {
        state.data =
          typeof methods.data === "object" ? methods.data : await getData(app);

        if (methods.sourceTree) {
          state.sourceTree = getSourceTree(app);
        }

        app.set("state", state);

        if (methods.menu) {
          promises.push(
            new Promise(async resolve => {
              state.menu = await getMenu(app);
              resolve();
            })
          );
        }
        resolve();
      })
    );
  } else {
    if (methods.sourceTree) {
      state.sourceTree = getSourceTree(app);
    }

    if (methods.menu) {
      promises.push(
        new Promise(async resolve => {
          state.menu = await getMenu(app);
          resolve();
        })
      );
    }
  }

  if (methods.partials) {
    state.partials = getPartials(app);
  }

  return await Promise.all(promises).then(() => {
    app.set("state", state);
    return app.get("state");
  });
};
