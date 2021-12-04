const jsdoc2md = require("jsdoc-to-markdown");
const fs = require("fs");
const { cp } = require("fs/promises");
const path = require("path");

const inputFolder = "./lib";
const inputFile = `${inputFolder}/**/*.js`;
const outputFolder = "./jsdoc/docs";
const pages = {};

const templateData = jsdoc2md.getTemplateDataSync({ files: inputFile });

fs.rm(path.join(process.cwd(), outputFolder), { recursive: true }, () => {
  cp(path.resolve("../../docs/docs/img"), path.resolve("jsdoc/docs/img"), {
    recursive: true,
  });
  cp(
    path.resolve("../../docs/docs/extra.css"),
    path.resolve("jsdoc/docs/extra.css"),
    {
      recursive: true,
    }
  );

  for (data of templateData) {
    if (pages[`${data.meta.path}/${data.meta.filename}`]) {
      pages[`${data.meta.path}/${data.meta.filename}`].push(data);
    } else {
      pages[`${data.meta.path}/${data.meta.filename}`] = [data];
    }
  }

  Object.entries(pages).forEach(([page, entries]) => {
    const output = jsdoc2md.renderSync({ data: entries });
    const filePath = page
      .replace(`${process.cwd()}/lib`, outputFolder)
      .replace(".js", ".md");
    fs.mkdir(path.dirname(filePath), { recursive: true }, function () {
      fs.writeFile(filePath, output, () => {});
    });
  });
});
