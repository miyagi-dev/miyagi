const getSourceStructure = require("./structure.js");

function normalizePath(path) {
  return path
    .replace(/\//g, "-")
    .replace(/\./g, "-")
    .replace(/_/g, "");
}

function getComponentFile(directory, templateExtension) {
  return directory.children.filter(
    child =>
      child.name.replace(`.${templateExtension}`, "") === directory.name &&
      child.extension === `.${templateExtension}`
  )[0];
}

function hasComponentFileWithCorrectNameAsChild(directory, templateExtension) {
  return (
    directory.children &&
    directory.children.length &&
    typeof getComponentFile(directory, templateExtension) !== "undefined"
  );
}

function getDataForLinkedDirectory(directory, partial) {
  return {
    type: directory.type,
    name: directory.name,
    path: partial.path,
    shortPath: partial.shortPath,
    extension: partial.extension,
    variations: directory.variations,
    index: directory.index,
    id: normalizePath(partial.shortPath)
  };
}

function getDataForDirectory(directory) {
  return {
    type: directory.type,
    name: directory.name,
    path: directory.path,
    index: directory.index,
    id: normalizePath(
      directory.path.replace(process.cwd().slice(1), "").slice(1)
    )
  };
}

function restructureDirectory(directory, templateExtension) {
  let item;

  if (hasComponentFileWithCorrectNameAsChild(directory, templateExtension)) {
    item = getDataForLinkedDirectory(
      directory,
      getComponentFile(directory, templateExtension)
    );
  } else {
    item = getDataForDirectory(directory);
  }

  return item;
}

function hasChildren(item) {
  return item.children && item.children.length > 1;
}

async function getStructure(app) {
  const srcStructure = await getSourceStructure(app);
  const templateExtension = app.get("config").extension;
  const arr = [];

  (function restructure(structure, array) {
    structure.forEach(item => {
      if (item.type === "directory") {
        const restructured = restructureDirectory(item, templateExtension);

        if (hasChildren(item)) {
          restructured.children = [];
          restructure(item.children, restructured.children);
        }

        array.push(restructured);
      }
    });
  })(srcStructure, arr);

  return arr;
}

module.exports = {
  getStructure
};
