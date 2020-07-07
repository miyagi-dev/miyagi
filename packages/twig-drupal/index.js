const twig = require("twig");
const twigDrupal = require("twig-drupal-filters");
const deepMerge = require("deepmerge");

twigDrupal(twig);

twig.extend(function (Twig) {
  Twig.exports.extendTag({
    type: "trans",
    regex: /^trans$/,
    next: ["endtrans", "plural", "variable"],
    open: true,
    compile: function (token) {
      return token;
    },
    parse: function (token, context, chain) {
      var html = "";

      token.output.forEach((output) => {
        if (output.type === "raw") {
          html += output.value;
        } else {
          if (output.type === "output") {
            html += Twig.expression.parse.apply(this, [output.stack, context]);
          }
        }
      });

      return {
        chain: chain,
        output: html,
      };
    },
  });

  Twig.exports.extendTag({
    type: "endtrans",
    regex: /^endtrans$/,
    next: [],
    open: false,
  });

  Twig.exports.extendTag({
    type: "plural",
    regex: /^plural\s+(.+)$/,
    next: ["endtrans"],
    open: false,
  });
});

module.exports = {
  engine: twig.twig,

  async extendTemplateData(file) {
    const opts = await convertTokensToAttributes(file);
    const o = {};

    Object.entries(opts).forEach(([attr, entries]) => {
      const ent = Object.keys(entries);
      if (ent.length > 0) {
        o[attr] = {};
        ent.forEach((method) => {
          switch (method) {
            case "addClass":
              o[attr][method] = function (values) {
                return ` class="${
                  values instanceof Array ? values.join(" ") : values
                }"`;
              };
              break;
            case "setAttribute":
              o[attr][method] = function (attr, values) {
                return ` ${attr}="${
                  values instanceof Array ? values.join(" ") : values
                }"`;
              };
              break;
          }
        });
      }
    });

    return o;
  },
};

/**
 * Accepts a path to a twig templates, gets all it tokens and based on that
 * returns an object with all Drupal attributes
 *
 * @param {string} path - twig template path
 * @returns {Promise} gets resolved with an object containing all Drupal attributes
 */
function convertTokensToAttributes(path) {
  return new Promise((resolve) => {
    twig.twig({
      path: require("path").join(process.cwd(), path),
      async load(template) {
        let opts = {};
        const tokens = template.tokens;

        if (tokens) {
          const outputTokens = tokens.filter(
            (token) => token.type === "output"
          );
          const logicTokens = tokens.filter((token) => token.type === "logic");

          outputTokens.forEach((token) => {
            const stackItem = token.stack.find(
              (item) =>
                item.type === "Twig.expression.type.variable" ||
                item.type === "Twig.logic.type.extends"
            );

            if (stackItem) {
              if (token.stack.length > 1) {
                const entry = token.stack.find(
                  (item) => item.type === "Twig.expression.type.variable"
                );

                if (entry) {
                  const key = entry.value;
                  const entries = {};
                  token.stack.forEach((item, i) => {
                    if (
                      item.type === "Twig.expression.type.key.period" &&
                      token.stack[i + 1] &&
                      token.stack[i + 1].type ===
                        "Twig.expression.type.parameter.end"
                    ) {
                      entries[item.key] = token.stack[i + 1].params
                        .filter((param) =>
                          Object.prototype.hasOwnProperty.call(param, "value")
                        )
                        .map((param) => param.value);
                    }
                  });

                  opts[key] = entries;
                }
              }
            }
          });

          for (const token of logicTokens) {
            if (token.token.type === "Twig.logic.type.extends") {
              opts = deepMerge(
                opts,
                await convertTokensToAttributes(token.token.stack[0].value)
              );
            }

            if (
              token.token.type === "Twig.logic.type.block" ||
              token.token.type === "Twig.logic.type.spaceless" ||
              token.token.type === "Twig.logic.type.if"
            ) {
              token.token.output.forEach((outputItem) => {
                if (outputItem.type === "output") {
                  if (outputItem.stack.length > 1) {
                    const entry = outputItem.stack.find(
                      (item) => item.type === "Twig.expression.type.variable"
                    );

                    if (entry) {
                      const key = entry.value;
                      const entries = {};
                      outputItem.stack.forEach((item, i) => {
                        if (
                          item.type === "Twig.expression.type.key.period" &&
                          outputItem.stack[i + 1] &&
                          outputItem.stack[i + 1].type ===
                            "Twig.expression.type.parameter.end"
                        ) {
                          entries[item.key] = outputItem.stack[i + 1].params
                            .filter((param) =>
                              Object.prototype.hasOwnProperty.call(
                                param,
                                "value"
                              )
                            )
                            .map((param) => param.value);
                        }
                      });
                      opts[key] = entries;
                    }
                  }
                }
              });
            }
          }
          resolve(opts);
        } else {
          resolve(opts);
        }
      },
    });
  });
}
