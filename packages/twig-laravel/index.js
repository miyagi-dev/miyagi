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
    const engineInstance = engine || Twig;

    locales = { ...defaults, ...locales };

    engineInstance.cache(false);

    await extendFunctions(engineInstance, await getLocales(locales));

    return engineInstance.twig;
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
