import colors from "./colors.js";
import typography from "./typography.js";
import spacings from "./spacings.js";
import mediaQueries from "./media-queries.js";

export const getColors = (obj, prefix) => {
	return colors(obj, prefix);
};
export const getTypography = (obj, prefix) => {
	return typography(obj, prefix);
};
export const getSpacings = (obj, prefix) => {
	return spacings(obj, prefix);
};
export const getMediaQueries = (obj) => {
	return mediaQueries(obj);
};
