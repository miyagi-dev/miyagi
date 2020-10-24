const { getCustomProperties } = require("./helpers.js");

module.exports = function getFonts(obj, prefix) {
  const props = [
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-size-adjust",
    "font-size",
    "font-stretch",
    "font-style",
    "font-variant-caps",
    "font-variant",
    "font-weight",
    "letter-spacing",
    "line-height",
    "text-shadow",
    "text-transform",
  ];

  const deduped = {};

  props.forEach((prop) => {
    getCustomProperties(obj, prop, true).forEach(({ property }) => {
      if (property.startsWith(`--${prefix}-`)) {
        const name = property
          .replace(`--${prefix}-`, "")
          .replace(`-${prop}`, "");
        const customPropName = property.replace(`-${prop}`, "");

        if (!deduped[name]) {
          deduped[name] = {
            customProp: customPropName,
            values: [],
          };
        }

        if (!deduped[name].values.find(({ value }) => value === property)) {
          deduped[name].values.push({
            label: prop,
            value: property,
          });
        }
      }
    });
  });

  return Object.entries(deduped).sort((a, b) =>
    a[0].toUpperCase() > b[0].toUpperCase() ? 1 : -1
  );
};
