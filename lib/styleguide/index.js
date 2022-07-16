module.exports = {
  getColors(obj, prefix) {
    return require("./colors.js")(obj, prefix);
  },
  getFonts(obj, prefix) {
    return require("./fonts.js")(obj, prefix);
  },
  getSpacings(obj, prefix) {
    return require("./spacings.js")(obj, prefix);
  },
  getMediaQueries(obj) {
    return require("./media-queries.js")(obj);
  },
};
