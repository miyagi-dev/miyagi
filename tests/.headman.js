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
    cssFiles: [],
    templates: {
      engine: "handlebars",
      extension: "hbs",
    },
    srcFolder: "src/",
    projectName: "headman",
    validations: {
      html: true,
      accessibility: true,
    },
  },
};
