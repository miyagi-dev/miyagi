module.exports = function extendFunctions(twig, locales) {
  twig.extendFunction("csrf_field", () => "");
  twig.extendFunction("session_has", () => false);
  twig.extendFunction("config", () => ({}));
  twig.extendFunction("route", (val) => val);
  twig.extendFunction("asset", (asset) => asset);
  twig.extendFunction("mix", (asset) => asset);
  twig.extendFunction("old", () => "");
  twig.extendFunction("trans", (string, opts) => {
    return trans(locales, string, opts);
  });
  twig.extendFunction("trans_choice", (string, value, opts) => {
    return transChoice(locales, string, value, opts);
  });
};

/**
 * @param {object} locales
 * @param {string} string
 * @param {object} opts
 * @returns {string}
 */
function trans(locales, string, opts) {
  let str = getObjectFromDotNotation(locales, string) || "";

  if (opts) {
    opts._keys.forEach((key) => {
      str = str.replace(`:${key}`, opts[key]);
    });
  }

  return str;
}

/**
 * @param {object} locales
 * @param {string} string
 * @param {number} value
 * @param {object} opts
 * @returns {string}
 */
function transChoice(locales, string, value, opts) {
  const strings = getObjectFromDotNotation(locales, string).split("|");
  const values = {};
  let str = "";

  strings.forEach((str) => {
    const singleMatch = str.match(new RegExp(/\{\d\}/));
    const multipleMatch = str.match(new RegExp(/\[[0-9,*]*\]/));

    if (singleMatch && singleMatch.length > 0) {
      values[singleMatch[0].replace("{", "").replace("}", "")] = str.replace(
        singleMatch[0],
        ""
      );
    } else if (multipleMatch && multipleMatch.length > 0) {
      const numbers = multipleMatch[0]
        .replace("[", "")
        .replace("]", "")
        .split(",");

      numbers.forEach((number) => {
        values[number] = str.replace(multipleMatch[0], "");
      });
    }
  });

  // simply checking by `if (value)` would not work as value could be 0
  if (value !== undefined && value !== null) {
    if (opts) {
      opts._keys.forEach((key) => {
        const val = values[value] || values["*"] || "";

        str = val.replace(`:${key}`, value);
      });
    } else {
      str = values[value] || values["*"];
    }
  }

  return str;
}

/**
 * @param {object} obj - object which should be searched for keys provided by dotNotation
 * @param {string} dotNotation - string like "foo.bar.baz"
 * @returns {any} - returns the value of the last key in the dotNotation
 */
function getObjectFromDotNotation(obj, dotNotation) {
  const arr = dotNotation.split(".");
  while (arr.length && (obj = obj[arr.shift()]));
  return obj || "";
}
