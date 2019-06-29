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
    getComponentFile(directory, templateExtension)
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
    children: directory.children,
    index: directory.index,
    id: normalizePath(partial.shortPath)
  };
}

function getDataForDirectory(directory) {
  return {
    type: directory.type,
    name: directory.name,
    path: directory.path,
    children: directory.children,
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

function getStructure(srcStructure, templateExtension) {
  const arr = [];

  (function restructure(structure) {
    structure.forEach(item => {
      if (item.type === "directory") {
        arr.push(restructureDirectory(item, templateExtension));
      }

      if (hasChildren(structure)) {
        restructure(structure);
      }
    });
  })(srcStructure);

  return arr;
}

module.exports = {
  getStructure
};
