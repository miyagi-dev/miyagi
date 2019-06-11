const fs = require("fs");
const path = require("path");

function resolveJsonURLs(req, data) {
  (function readJson(data) {
    Object.entries(data).forEach(entry => {
      if (
        typeof entry[1] === "string" &&
        entry[1].indexOf(".json") >= 0 &&
        entry[1].indexOf(".json") === entry[1].length - 5
      ) {
        const file = fs.readFileSync(
          path.join(
            process.cwd(),
            `${req.app.get("config").srcFolder}/${entry[1].replace(/\0/g, "")}`
          ),
          "utf8"
        );

        if (file) {
          data[entry[0]] = JSON.parse(file).data;

          readJson(data[entry[0]]);
        }
      }
    });
  })(data);
  return data;
}

function renderMain(req, res) {
  res.render("index.hbs", {
    folders: req.app.get("state").srcStructure,
    iframeSrc: `${req.protocol}://${req.headers.host}/?pattern=all`,
    showAll: true
  });
}

function renderMainWithPattern(req, res, pattern, variation) {
  let iframeSrc = `${req.protocol}://${req.headers.host}/?pattern=${pattern}`;

  if (variation) {
    iframeSrc += `&variation=${variation}`;
  }

  res.render("index.hbs", {
    folders: req.app.get("state").srcStructure,
    iframeSrc,
    currentPattern: req.query.show,
    currentVariation: req.query.variation
  });
}

function renderPattern(req, res, pattern, variation) {
  const variations = req.app.get("state").jsonData[pattern].variations;
  const patternData = req.app.get("state").jsonData[pattern].data;
  let context;

  if (variations) {
    const variationJson = variations.filter(
      vari => vari.name === decodeURI(variation)
    )[0];
    const variationData = variationJson
      ? resolveJsonURLs(req, variationJson.data)
      : {};

    context = Object.assign({}, patternData, variationData);
  } else {
    context = patternData;
  }

  req.app.render(pattern, context, (err, html) => {
    res.render("pattern.hbs", { html });
  });
}

function renderPatternVariations(req, res, pattern) {
  const json = req.app.get("state").jsonData[pattern];
  const data = json.data ? resolveJsonURLs(req, json.data) : {};

  if (json.variations) {
    const context = [{ pattern, data }];

    json.variations.forEach(entry => {
      context.push({ pattern, data: Object.assign({}, json.data, entry.data) });
    });

    const html = [];
    const promises = [];

    context.forEach((entry, i) => {
      promises.push(
        new Promise(resolve => {
          req.app.render(pattern, entry.data, (err, result) => {
            html[i] = result;
            resolve(result);
          });
        })
      );
    });

    Promise.all(promises).then(() => {
      res.render("pattern_variations.hbs", {
        html
      });
    });
  } else {
    req.app.render(pattern, data, (err, html) => {
      res.render("pattern.hbs", { html });
    });
  }
}

async function renderPatternOverview(req, res) {
  const html = [];
  const promises = [];

  const patterns = req.app
    .get("state")
    .filePaths.map(path => [path, req.app.get("state").jsonData[path].data]);

  patterns.forEach((pattern, i) => {
    promises.push(
      new Promise(resolve => {
        req.app.render(
          pattern[0],
          Object.assign({}, pattern[1]),
          (err, result) => {
            html[i] = result;
            resolve();
          }
        );
      })
    );
  });

  Promise.all(promises).then(() => {
    res.render("pattern_overview.hbs", {
      html
    });
  });
}

module.exports = {
  renderMain,
  renderMainWithPattern,
  renderPattern,
  renderPatternVariations,
  renderPatternOverview
};
