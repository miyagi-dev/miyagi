const Twig = require("twig");

const extendFunctions = require("./lib/extend-functions.js");
const getLocales = require("./lib/get-locales.js");

const defaults = {
  folder: "resources/lang",
  lang: "en",
};

module.exports = {
  engine: Twig.twig,

  async extendEngine({ engine, locales }) {
    const twig = engine || Twig;

    locales = { ...defaults, ...locales };

    twig.cache(false);

    await extendFunctions(twig, await getLocales(locales));
  },

  extendWatcher({ locales }) {
    return { ...defaults, ...locales };
  },

  callbacks: {
    async fileChanged(opts) {
      await module.exports.extendEngine(opts);
    },
  },
};
