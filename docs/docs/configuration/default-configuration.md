Please refer to the [available options](/configuration/options/) for a full explanation and possible values.

```json
{
  "assets": {
    "root": "",
    "css": [],
    "customProperties": {
      "files": [],
      "prefixes": {
        "typo": "typo",
        "color": "color",
        "spacing": "spacing"
      }
    },
    "folder": [],
    "js": [],
    "manifest": null
  },
  "build": {
    "basePath": "/",
    "folder": "build",
    "outputFile": false
  },
  "components": {
    "folder": "src",
    "ignores": [
      "node_modules",
      ".git",
      "package.json",
      "package-lock.json",
      ".miyagi.js",
      ".miyagi.json"
    ],
    "lang": "en",
    "renderInIframe": {
      "default": false,
      "except": []
    },
    "textDirection": "ltr"
  },
  "engine": {
    "instance": null,
    "name": null,
    "options": {}
  },
  "files": {
    "css": {
      "name": "index",
      "extension": "css"
    },
    "docs": {
      "name": "README",
      "extension": "md"
    },
    "info": {
      "name": "info",
      "extension": "json"
    },
    "js": {
      "name": "index",
      "extension": "js"
    },
    "mocks": {
      "name": "mocks",
      "extension": "json"
    },
    "schema": {
      "name": "schema",
      "extension": "json"
    },
    "templates": {
      "name": "index"
    }
  },
  "extensions": [],
  "projectName": "miyagi",
  "ui": {
    "reload": true,
    "reloadAfterChanges": {
      "componentAssets": false
    },
    "textDirection": "ltr",
    "theme": {
      "css": null,
      "favicon": null,
      "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      "js": null,
      "logo": null,
      "mode": "light",
      "light": {
        "logo": null,
        "navigation": {
          "colorText": "var(--Miyagi-color-Text-internal)",
          "colorBackground": "var(--Miyagi-color-Background-internal)",
          "colorLinks": "var(--Miyagi-color-Link-internal)",
          "colorLinksActive": "var(--Miyagi-color-Link-active-internal)",
          "colorLinksActiveBackground": "var(--Miyagi-color-Link-active-background-internal)",
          "colorSearchText": "var(--Miyagi-color-Search-text-internal)",
          "colorSearchBackground": "var(--Miyagi-color-Search-background-internal)",
          "colorSearchBorder": "var(--Miyagi-color-Search-border-internal)"
        },
        "content": {
          "colorBackground": "var(--Miyagi-color-Background-internal)",
          "colorText": "var(--Miyagi-color-Text-internal)",
          "colorHeadline1": "var(--Miyagi-colorHeadline1-internal)",
          "colorHeadline2": "var(--Miyagi-colorHeadline2-internal)"
        }
      },
      "dark": {
        "logo": null,
        "navigation": {
          "colorText": "var(--Miyagi-color-Text-internal)",
          "colorBackground": "var(--Miyagi-color-Background-internal)",
          "colorLinks": "var(--Miyagi-color-Link-internal)",
          "colorLinksActive": "var(--Miyagi-color-Link-active-internal)",
          "colorLinksActiveBackground": "var(--Miyagi-color-Link-active-background-internal)",
          "colorSearchText": "var(--Miyagi-color-Search-text-internal)",
          "colorSearchBackground": "var(--Miyagi-color-Search-background-internal)",
          "colorSearchBorder": "var(--Miyagi-color-Search-border-internal)"
        },
        "content": {
          "colorBackground": "var(--Miyagi-color-Background-internal)",
          "colorText": "var(--Miyagi-color-Text-internal)",
          "colorHeadline1": "var(--Miyagi-colorHeadline1-internal)",
          "colorHeadline2": "var(--Miyagi-colorHeadline2-internal)"
        }
      }
    },
    "validations": {
      "accessibility": true,
      "html": true
    }
  },
  "schema": {}
}
```
