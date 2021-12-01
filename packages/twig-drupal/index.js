const twig = require("twig");
const twigDrupal = require("twig-drupal-filters");
const twigDrupalWithout = require("twig-drupal-filters/filters/without");

/**
 * @param {Array} args
 */
function DrupalAttribute(args) {
  this.args = args;

  this.args.forEach((arg) => {
    if (arg[0] !== "$drupal") {
      this[arg[0]] = arg[1];
    }
  });

  /**
   * @returns {DrupalAttribute}
   */
  this.addClass = function () {
    let self = this;
    let values = [];

    for (let i = 0; i < arguments.length; i++) {
      values.push(arguments[i]);
    }

    values.forEach(function (value) {
      if (!Array.isArray(value)) {
        value = [value];
      }

      if (!self.class) {
        self.class = [];
      }

      let classes = self.class;

      value.forEach(function (d) {
        if (classes.indexOf(d) < 0) {
          classes.push(d);
        }
      });
    });

    return this;
  };

  this.removeClass = function (value) {
    let classes = [];

    if (this.class) {
      classes = this.class;
    }

    if (!Array.isArray(value)) {
      value = [value];
    }

    value.forEach(function (v) {
      let index = classes.indexOf(v);

      if (index > -1) {
        classes.splice(index, 1);
      }
    });

    return this;
  };

  this.hasClass = function (value) {
    let classes = [];

    if (this.class) {
      classes = this.class;
    }

    return classes.indexOf(value) > -1;
  };

  this.setAttribute = function (key, value) {
    this.set(key, value);

    return this;
  };

  this.removeAttribute = function (key) {
    this.delete(key);

    return this;
  };
}
DrupalAttribute.prototype.toString = function () {
  let result = "";
  let components = [];

  this.args.forEach(([value, key]) => {
    if (Array.isArray(value)) {
      value = value.join(" ");
    }

    if (value !== "$drupal") {
      components.push([value, '"' + key + '"'].join("="));
    }
  });

  let rendered = components.join(" ");

  if (rendered) {
    result += " " + rendered;
  }

  return result;
};

module.exports = {
  engine: twig.twig,

  extendEngine({ engine, init }) {
    const engineInstance = engine || twig;

    engineInstance.cache(false);

    twigDrupal(engineInstance);

    engineInstance.extendFilter("without", function (value, args) {
      if (!value) return {};

      if (typeof value === "string") {
        let str = value;

        args.forEach((a) => {
          const pattern = `/\\s${a}="[^"]*"/`;
          str = value.replace(new RegExp(pattern), "");
        });

        return str;
      }

      if (value.args && value.args.find((arg) => arg[0] === "$drupal")) {
        const values = { ...value };
        values.args = values.args.filter((arg) => {
          return !args.includes(arg[0]);
        });

        return DrupalAttribute.prototype.toString.call(values);
      }

      return twigDrupalWithout(value, args);
    });

    engineInstance.extend(function (Twig) {
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
                html += Twig.expression.parse.apply(this, [
                  output.stack,
                  context,
                ]);
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

    if (init && typeof init === "function") {
      init(engineInstance);
    }

    return engineInstance.twig;
  },

  async extendTemplateData(file, engineOptions = {}, data = {}) {
    if (
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean"
    ) {
      return data;
    }

    if (Array.isArray(data)) {
      data.forEach(async (entry, i) => {
        data[i] = await this.extendTemplateData(file, engineOptions, entry);
      });

      return data;
    }

    const o = {};
    Object.entries(data).forEach(async ([attr, entries]) => {
      if (entries) {
        if (entries["$drupal"]) {
          o[attr] = new DrupalAttribute(Object.entries(entries));
        } else if (
          typeof entries === "string" ||
          typeof entries === "number" ||
          typeof entries === "boolean"
        ) {
          o[attr] = entries;
        } else {
          o[attr] = await this.extendTemplateData(file, engineOptions, entries);
        }
      }
    });

    return o;
  },
};
