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
    engine: {
      name: "handlebars",
    },
    files: {
      templates: {
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
