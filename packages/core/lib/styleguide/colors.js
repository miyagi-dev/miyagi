const { getCustomProperties } = require("./helpers.js");

module.exports = function getColors(obj, prefix) {
  const types = ["typo", "decoration"];
  const uppercasedPrefix = prefix.toUpperCase();

  const colors = getCustomProperties(obj, "color")
    .filter(({ property, value }) => {
      const uppercasedValue = value.toUpperCase();
      return (
        property.match(`--${prefix}-(.)*`) &&
        (uppercasedValue.startsWith("RGBA") ||
          uppercasedValue.startsWith("#") ||
          uppercasedValue.startsWith("HSL") ||
          uppercasedValue.startsWith("VAR(--"))
      );
    })
    .map(({ property, value }) => {
      const uppercasedValue = value.toUpperCase();
      const whitesArr = [
        "#FFF",
        "#FFFFFF",
        "HSL(0, 0%, 100%)",
        "HSL(0,0%,100%)",
        "RGB(255, 255, 255)",
        "RGB(255,255,255)",
        "RGBA(255, 255, 255, 1)",
        "RGBA(255,255,255,1)",
        "WHITE",
        `VAR(--${uppercasedPrefix}-WHITE)`,
      ];

      types.forEach((type) => {
        const uppercasedType = type.toUpperCase();

        whitesArr.push(
          `RGB(VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-R),VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-G),VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-B))`,
          `RGB(VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-R), VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-G), VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-B))`,
          `RGBA(VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-R),VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-G),VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-B),VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-A))`,
          `RGBA(VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-R), VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-G), VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-B), VAR(--${uppercasedPrefix}-${uppercasedType}-WHITE-A))`
        );
      });

      const whites = new Set(whitesArr);
      const customPropertyWithoutPrefix = property.replace(`--${prefix}-`, "");
      const name = customPropertyWithoutPrefix
        .replace(`${types[0]}-`, "")
        .replace(`${types[1]}-`, "");
      let type;

      types.forEach((t) => {
        if (
          customPropertyWithoutPrefix.toUpperCase().startsWith(t.toUpperCase())
        ) {
          type = t;
        }
      });

      return {
        name,
        type,
        customProp: property,
        values: ["RGB", "Hex", "HSL"],
        isWhite: whites.has(uppercasedValue),
      };
    });

  const deduped = [
    {
      type: "all",
      styles: [],
    },
  ];

  types.forEach((type) => {
    deduped.push({
      type,
      styles: [],
    });
  });

  colors.forEach((color) => {
    const t = color.type || "all";

    if (
      !deduped
        .find(({ type }) => type === t)
        .styles.find(({ name }) => name === color.name)
    ) {
      deduped
        .find(({ type }) => type === t)
        .styles.push({
          name: color.name,
          customProp: color.customProp,
          values: color.values,
          isWhite: color.isWhite,
        });
    }
  });

  return deduped.map((entry) => {
    entry.styles = entry.styles.sort((a, b) =>
      a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
    );
    return entry;
  });
};
