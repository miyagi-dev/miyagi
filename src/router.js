const {
  renderPatternOverview,
  renderPattern,
  renderPatternVariations,
  renderMainWithPattern,
  renderMain
} = require("./render.js");

function checkIfRequestedPatternIsValid(app, pattern) {
  return app.get("state").filePaths.indexOf(pattern) >= 0;
}

module.exports = function(app) {
  app.get("/", (req, res) => {
    if (req.query.pattern === "all") {
      renderPatternOverview(req, res);
    } else if (checkIfRequestedPatternIsValid(app, req.query.pattern)) {
      if (req.query.variation) {
        renderPattern(req, res, req.query.pattern, req.query.variation);
      } else {
        renderPatternVariations(req, res, req.query.pattern);
      }
    } else if (checkIfRequestedPatternIsValid(app, req.query.show)) {
      renderMainWithPattern(req, res, req.query.show, req.query.variation);
    } else {
      renderMain(req, res);
    }
  });
};
