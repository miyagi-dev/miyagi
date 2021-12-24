import Colors from "./colors.js";
import Fonts from "./fonts.js";
import Spacings from "./spacings.js";
import MediaQueries from "./media-queries.js";

export const getColors = function (obj, prefix) {
  return Colors(obj, prefix);
};
export const getFonts = function (obj, prefix) {
  return Fonts(obj, prefix);
};
export const getSpacings = function (obj, prefix) {
  return Spacings(obj, prefix);
};
export const getMediaQueries = function (obj) {
  return MediaQueries(obj);
};
