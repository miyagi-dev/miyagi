const jsdoc2md = require("jsdoc-to-markdown");
const fs = require("fs-extra");
const path = require("path");

const inputFolder = "./lib";
const inputFile = `${inputFolder}/**/*.js`;
const outputFolder = "./jsdoc";
const pages = {};

const templateData = jsdoc2md.getTemplateDataSync({ files: inputFile });

fs.removeSync(path.join(process.cwd(), outputFolder));

fs.copy('../../docs/img', 'jsdoc/img');
fs.copy('../../docs/extra.css', 'jsdoc/extra.css');

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
    fs.writeFile(filePath, output, () => { });
  });
});
