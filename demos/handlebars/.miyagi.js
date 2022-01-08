module.exports = {
  projectName: "miyagi demo",
  assets: {
    css: {
      development: ["src/index.css"],
      production: ["dist/index.css"],
    },
    customProperties: {
      files: ["src/index.css"],
    },
    js: ["src/index.js"],
  },
  ui: {
    theme: {
      light: {
        logo: "src/logo.svg",
      },
      dark: {
        logo: "src/logo-white.svg",
      },
    },
    validations: {
      html: false,
      accessibility: true,
    },
  },
};
