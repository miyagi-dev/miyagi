module.exports = {
  plugins: [
    {
      plugin: "twig-plugin",
      options: {
        extendFunction: {
          patternlab_path: () => "",
        },
      },
    },
  ],
  config: {
    assets: {
      css: [],
    },
    files: {
      templates: {
        engine: "handlebars",
        extension: "hbs",
      },
    },
    components: {
      folder: "src/",
    },
    projectName: "headman",
    ui: {
      validations: {
        html: true,
        accessibility: true,
      },
    },
  },
};
