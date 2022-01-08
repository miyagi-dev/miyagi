module.exports = {
  projectName: "Web Components Demo",
  assets: {
    js: {
      src: "src/index.js",
      type: "module",
    },

    folder: ["src"],
  },
  ui: {
    theme: {
      light: {
        logo: "src/logo.svg",
      },
      dark: {
        logo: "src/logo.svg",
      },
    },
    validations: {
      html: false,
      accessibility: true,
    },
  },
};
