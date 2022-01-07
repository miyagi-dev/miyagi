const fs = require("fs");
const path = require("path");

/**
 * @param {Array} menu
 * @param {boolean} isBuild
 * @returns {Array}
 */
module.exports = function getComponents(menu, isBuild) {
  if (!menu) return [];

  const components = [];

  (function iterate(arr) {
    arr.forEach((entry) => {
      if (entry.shortPath && entry.normalizedShortPath) {
        const componentName = path.basename(entry.shortPath);
        const assetNames = {
          css: `${componentName}.miyagi.css`,
          js: `${componentName}.miyagi.js`,
        };

        components.push({
          shortPath: entry.shortPath,
          value: isBuild ? entry.normalizedShortPath : entry.shortPath,
          assets: {
            css: fs.existsSync(path.join(entry.fullPath, assetNames.css))
              ? path.join(entry.shortPath, assetNames.css)
              : false,
            js: fs.existsSync(path.join(entry.fullPath, assetNames.js))
              ? path.join(entry.shortPath, assetNames.js)
              : false,
          },
        });
      }

      if (entry.children && entry.children.length > 0) {
        iterate(entry.children);
      }
    });
  })(menu);

  return components;
};
