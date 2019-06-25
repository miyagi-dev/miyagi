const {
  renderComponentOverview,
  renderComponent,
  renderComponentVariations,
  renderMainWithComponent,
  renderMain
} = require("./render/index.js");

function checkIfRequestedComponentIsValid(app, component) {
  return app.get("state").filePaths.indexOf(component) >= 0;
}

module.exports = function(app) {
  app.get("/", (req, res) => {
    if (req.query.component === "all") {
      renderComponentOverview(req, res, req.query.embedded);
    } else if (checkIfRequestedComponentIsValid(app, req.query.component)) {
      if (req.query.variation) {
        renderComponent(
          req,
          res,
          req.query.component,
          req.query.variation,
          req.query.embedded
        );
      } else {
        renderComponentVariations(
          req,
          res,
          req.query.component,
          req.query.embedded
        );
      }
    } else if (checkIfRequestedComponentIsValid(app, req.query.show)) {
      renderMainWithComponent(req, res, req.query.show, req.query.variation);
    } else {
      renderMain(req, res);
    }
  });
};
