function normalizePath(path) {
  return path
    .replace(/\//g, "-")
    .replace(/\./g, "-")
    .replace(/_/g, "");
}

function getComponentFile(folder, templateExtension) {
  return folder.children.filter(
    child =>
      child.name.replace(`.${templateExtension}`, "") === folder.name &&
      child.extension === `.${templateExtension}`
  )[0];
}

function hasComponentFileWithCorrectNameAsChild(folder, templateExtension) {
  return (
    folder.children &&
    folder.children.length &&
    getComponentFile(folder, templateExtension)
  );
}

function getDataForLinkedFolder(folder, partial) {
  return {
    type: folder.type,
    name: folder.name,
    path: partial.path,
    shortPath: partial.shortPath,
    extension: partial.extension,
    variations: folder.variations,
    children: folder.children,
    index: folder.index,
    id: normalizePath(partial.shortPath)
  };
}

function getDataForFolder(folder) {
  return {
    type: folder.type,
    name: folder.name,
    path: folder.path,
    children: folder.children,
    index: folder.index,
    id: normalizePath(folder.path.replace(process.cwd().slice(1), "").slice(1))
  };
}

function restructureFolder(folder, templateExtension) {
  let item;

  if (hasComponentFileWithCorrectNameAsChild(folder, templateExtension)) {
    item = getDataForLinkedFolder(
      folder,
      getComponentFile(folder, templateExtension)
    );
  } else {
    item = getDataForFolder(folder);
  }

  return item;
}

function hasChildren(item) {
  return item.children && item.children.length > 1;
}

module.exports = (srcStructure, templateExtension) => {
  const arr = [];

  (function restructure(structure) {
    structure.forEach(item => {
      if (item.type === "directory") {
        arr.push(restructureFolder(item, templateExtension));
      }

      if (hasChildren(structure)) {
        restructure(structure);
      }
    });
  })(srcStructure);

  return arr;
};
