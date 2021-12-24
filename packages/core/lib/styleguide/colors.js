import { getCustomProperties } from "./helpers.js";
import colorNames from "./color-names.js";

export default function getColors(obj, prefix) {
  const types = ["typo", "decoration"];
  const uppercasedPrefix = prefix.toUpperCase();

  const colors = getCustomProperties(obj, "color")
    .filter(({ property, value }) => {
      const lowerCasedValue = value.toLowerCase();
      return (
        property.match(`--${prefix}-(.)*`) &&
        (lowerCasedValue.startsWith("rgb(") ||
          lowerCasedValue.startsWith("rgba(") ||
          (lowerCasedValue.startsWith("#") &&
            Boolean(lowerCasedValue.match(new RegExp(/^#[a-f0-9]{3,8}$/)))) ||
          lowerCasedValue.startsWith("hsl(") ||
          lowerCasedValue.startsWith("hsla(") ||
          (lowerCasedValue.startsWith("var(--") &&
            lowerCasedValue.endsWith(")")) ||
          colorNames.includes(value))
      );
    })
    .map(({ property, value }) => {
      const lowerCasedValue = value.toLowerCase();
      const whitesArr = [
        "#fff",
        "#ffff",
        "#ffffff",
        "#ffffffff",
        "hsl(0,0%,100%)",
        "hsl(0, 0%,100%)",
        "hsl(0,0%, 100%)",
        "hsl(0, 0%, 100%)",
        "rgb(255,255,255)",
        "rgb(255, 255,255)",
        "rgb(255,255, 255)",
        "rgb(255, 255, 255)",
        "rgba(255,255,255,1)",
        "rgba(255, 255,255,1)",
        "rgba(255, 255, 255,1)",
        "rgba(255, 255,255, 1)",
        "rgba(255,255, 255,1)",
        "rgba(255,255, 255, 1)",
        "rgba(255,255,255, 1)",
        "rgba(255, 255, 255, 1)",
        "white",
        `var(--${uppercasedPrefix}-white)`,
      ];

      types.forEach((type) => {
        const uppercasedType = type.toUpperCase();

        whitesArr.push(
          `rgba(var(--${uppercasedPrefix}-${uppercasedType}-white-r),var(--${uppercasedPrefix}-${uppercasedType}-white-g),var(--${uppercasedPrefix}-${uppercasedType}-white-b))`,
          `rgba(var(--${uppercasedPrefix}-${uppercasedType}-white-r), var(--${uppercasedPrefix}-${uppercasedType}-white-g), var(--${uppercasedPrefix}-${uppercasedType}-white-b))`,
          `rgbaa(var(--${uppercasedPrefix}-${uppercasedType}-white-r),var(--${uppercasedPrefix}-${uppercasedType}-white-g),var(--${uppercasedPrefix}-${uppercasedType}-white-b),var(--${uppercasedPrefix}-${uppercasedType}-white-a))`,
          `rgbaa(var(--${uppercasedPrefix}-${uppercasedType}-white-r), var(--${uppercasedPrefix}-${uppercasedType}-white-g), var(--${uppercasedPrefix}-${uppercasedType}-white-b), var(--${uppercasedPrefix}-${uppercasedType}-white-a))`
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
        isWhite: whites.has(lowerCasedValue),
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
}
