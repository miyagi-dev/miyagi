module.exports = (srcStructure, extension) => {
  const arr = [];

  (function restructure(str) {
    str.forEach(s => {
      if (s.type === "directory") {
        if (
          s.children &&
          s.children.length &&
          s.children.filter(
            child =>
              child.name.replace(`.${extension}`, "") === s.name &&
              child.extension === `.${extension}`
          )[0]
        ) {
          const partial = s.children.filter(
            child =>
              child.name.replace(`.${extension}`, "") === s.name &&
              child.extension === `.${extension}`
          )[0];

          if (partial) {
            arr.push({
              type: s.type,
              name: partial.name,
              path: partial.path,
              shortPath: partial.shortPath,
              extension: partial.extension,
              variations: s.variations,
              children: s.children,
              index: s.index,
              id: partial.shortPath
                .replace(/\//g, "-")
                .replace(/\./g, "-")
                .replace(/_/g, "")
            });
          }
        } else {
          arr.push({
            type: s.type,
            name: s.name,
            path: s.path,
            children: s.children,
            index: s.index,
            id: s.path
              .replace(process.cwd().slice(1), "")
              .slice(1)
              .replace(/\//g, "-")
              .replace(/\./g, "-")
              .replace(/_/g, "")
          });
        }
      }

      if (str.children && str.children.length > 1) {
        restructure(str);
      }
    });
  })(srcStructure);

  return arr;
};
