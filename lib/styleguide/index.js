module.exports = {
	getColors(obj, prefix) {
		return require("./colors.js")(obj, prefix);
	},
	getTypography(obj, prefix) {
		return require("./typography.js")(obj, prefix);
	},
	getSpacings(obj, prefix) {
		return require("./spacings.js")(obj, prefix);
	},
	getMediaQueries(obj) {
		return require("./media-queries.js")(obj);
	},
};
