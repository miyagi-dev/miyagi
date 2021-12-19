/**
 * @param {Array} menu
 * @param {boolean} isBuild
 * @returns {Array}
 */
module.exports = function getFlatMenu(menu, isBuild) {
  if (!menu) return [];

  const flatMenu = [];

  (function iterate(arr) {
    arr.forEach((entry) => {
      if (entry.shortPath && entry.normalizedShortPath) {
        flatMenu.push({
          component: entry.shortPath,
          value: isBuild ? entry.normalizedShortPath : entry.shortPath,
        });
      }

      if (entry.children && entry.children.length > 0) {
        iterate(entry.children);
      }
    });
  })(menu);

  return flatMenu;
};
