const getPartials = require("./partials.js");
const { getFileContents } = require("./file-contents.js");
const { getMenu } = require("./menu");
const { getSourceTree } = require("./source-tree.js");

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
        state.partials = getPartials(app);
        resolve();
      })
    );
  }

  return Promise.all(promises).then(() => {
    app.set("state", state);
    return app.get("state");
  });
};
