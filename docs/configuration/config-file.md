**`.miyagi.json`** or **`.miyagi.js`**

The config file can either be a JSON file or JS file with a CommonJS module, if you want to [extend your template engine](/configuration/extending-template-engine).

This is an example for a JSON config file:

```javascript
// .miyagi.json

{
  "assets": {
    "folder": "assets/",
    "css": {
      "development": ["src/index.css"],
      "production": ["build/index.css"]
    },
    "jsFiles": {
      "development": ["src/index.js"],
      "production": ["build/index.js"]
    }
  },
  "build": {
    "folder": "dist/",
  },
  "components": {
    "folder": "source/",
    "ignores": [
      "tests",
    ]
  },
  "engine": {
    "name": "twig",
    "options": {
      "namespaces": {
        "miyagi": "src/"
      }
    }
  },
  "files": {
    "templates": {
      "extension": "twig",
    },
  },
  "projectName": "miyagi",
  "ui": {
    "reload": false,
    "theme": {
      "favicon": "src/favicon.ico",
      "logo": "src/logo.svg",
      "navigation": {
        "colorBackground": "#eee",
        "colorLinks": "#255e8a",
        "colorLinksActive": "#fff"
      },
      "content": {
        "colorHeadlines": "#255e8a",
        "colorText": "#234"
      }
    },
    "validations": {
      "html": false,
      "accessibility": false
    }
  }
}
```

_**NOTE:** None of these options is required, miyagi can also run with its default configuration. However, if you start miyagi with a valid configuration file, you can update it and miyagi will automatically apply the new configuration. It is not necessary to restart miyagi._
