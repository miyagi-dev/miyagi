module.exports = {
  projectName: "miyagi demo",
  assets: {
    css: {
      development: ["src/index.css"],
      production: ["dist/index.css"],
    },
    js: ["src/index.js"],
  },
  ui: {
    theme: {
      logo: "src/logo.svg",
    },
    validations: {
      html: false,
      accessibility: true,
    },
  },
};
