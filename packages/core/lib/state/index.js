/**
 * Module for saving all relevant data
 *
 * @module state
 */

const { getPartials } = require("./partials.js");
const { getFileContents } = require("./file-contents.js");
const getCSS = require("./css");
const { getMenu } = require("./menu");
const { getSourceTree } = require("./source-tree.js");

/**
 * @param {object} app - the express instance
 * @param {object} methods - object with keys defining what should be set
 * @param {object} state - the state object
 * @returns {Promise} gets resolved after the state has been updated
 */
function setSourceTreeAndMenu(app, methods, state) {
  return new Promise((resolve) => {
    if (methods.sourceTree) {
      state.sourceTree = getSourceTree(app);
    }

    app.set("state", state);

    if (methods.menu) {
      state.menu = getMenu(app);
      resolve();
    } else {
      resolve();
    }
  });
}

module.exports = async function setState(app, methods) {
  const promises = [];
  const state = app.get("state") || {};

  if (methods.fileContents) {
    if (typeof methods.fileContents === "object") {
      state.fileContents = methods.fileContents;

      promises.push(
        new Promise((resolve) => {
          setSourceTreeAndMenu(app, methods, state).then(resolve);
        })
      );
    } else {
      getFileContents(app).then((data) => {
        state.fileContents = data;

        promises.push(
          new Promise((resolve) => {
            setSourceTreeAndMenu(app, methods, state).then(resolve);
          })
        );
      });
    }
  } else {
    promises.push(
      new Promise((resolve) => {
        setSourceTreeAndMenu(app, methods, state).then(resolve);
      })
    );
  }

  if (methods.partials) {
    promises.push(
      new Promise((resolve) => {
        getPartials(app).then((result) => {
          state.partials = result;
          resolve();
        });
      })
    );
  }

  if (methods.css) {
    promises.push(
      new Promise((resolve) => {
        getCSS(app).then((result) => {
          state.css = result;
          resolve();
        });
      })
    );
  }

  return Promise.all(promises).then(() => {
    app.set("state", state);
    return app.get("state");
  });
};
