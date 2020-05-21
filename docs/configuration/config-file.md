This is an example for a config file:

```javascript
// .headman.js

module.exports = {
  assets: {
    folder: "assets/",
    css: {
      development: ["src/index.css"],
      production: ["build/index.css"]
    },
    es6Modules: true,
    jsFiles: {
      development: ["src/index.js"],
      production: ["build/index.js"]
    }
  },
  build: {
    folder: "dist/",
  },
  components: {
    folder: "src/",
    ignores: [
      "tests",
    ]
  },
  engine: {
    engine: "twig",
    namespaces: {
      headman: "src/"
    }
  },
  files: {
    templates: {
      extension: "twig",
    },
  },
  projectName: "headman",
  ui: {
    reload: false,
    theme: {
      favicon: "src/favicon.ico",
      logo: "src/logo.svg",
      navigation: {
        colorBackground: "#eee",
        colorLinks: "#255e8a",
        colorLinksActive: "#fff"
      },
      content: {
        colorHeadlines: "#255e8a",
        colorText: "#234"
      }
    },
    validations: {
      html: false,
      accessibility: false
    }
  }
};
```

_**NOTE:** Only `engine.name` and `files.templates.extension` are required. All other options are optional._
