const render = require("./render/index.js");

function checkIfRequestedComponentIsValid(app, component) {
  return app.get("state").filePaths.indexOf(component) >= 0;
}

module.exports = function(app) {
  app.get("/", (req, res) => {
    if (req.query.component) {
      if (req.query.component === "all") {
        render.renderComponentOverview(req, res, req.query.embedded);
      } else if (checkIfRequestedComponentIsValid(app, req.query.component)) {
        if (req.query.variation) {
          render.renderComponent(
            req,
            res,
            req.query.component,
            req.query.variation,
            req.query.embedded
          );
        } else {
          render.renderComponentVariations(
            req,
            res,
            req.query.component,
            req.query.embedded
          );
        }
      } else {
        render.renderMain(req, res);
      }
    } else if (req.query.show) {
      if (checkIfRequestedComponentIsValid(app, req.query.show)) {
        render.renderMainWithComponent(
          req,
          res,
          req.query.show,
          req.query.variation
        );
      } else {
        render.renderMain(req, res);
      }
    } else {
      render.renderMain(req, res);
    }
  });
};
