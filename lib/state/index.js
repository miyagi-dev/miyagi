"use strict";

const getPartials = require("../state/partials.js");
const { getData } = require("../state/data.js");
const { getMenu } = require("../state/menu/index.js");
const getSourceTree = require("../state/source-tree.js");

module.exports = async function(app, methods) {
  const promises = [];
  const state = app.get("state") || {};

  if (methods.data) {
    promises.push(
      new Promise(async resolve => {
        state.data =
          typeof methods.data === "object" ? methods.data : await getData(app);
        resolve();
      })
    );
  }

  if (methods.sourceTree) {
    state.sourceTree = getSourceTree(app);
  }

  if (methods.menu) {
    promises.push(
      new Promise(async resolve => {
        state.menu = await getMenu(app, state.sourceTree);
        resolve();
      })
    );
  }

  if (methods.partials) {
    state.partials = getPartials(app);
  }

  return await Promise.all(promises).then(() => {
    app.set("state", state);
    return app.get("state");
  });
};