# Configuration file

**`.miyagi.{js|mjs}`**

The config file needs to be a JS file with an ES module default export for the configuration:

Example:

```javascript
// .miyagi.js

export default {
	assets: {
		folder: "assets/",
		css: {
			development: ["src/index.css"],
			production: ["build/index.css"],
		},
		jsFiles: {
			development: ["src/index.js"],
			production: ["build/index.js"],
		},
	},
	build: {
		folder: "dist/",
	},
	components: {
		folder: "source/",
		ignores: ["tests"],
	},
	engine: {
		name: "twig",
		async render({ name, context, cb }) {
			try {
				cb(null, Twig.render(name, context));
			} catch (err) {
				cb(err);
			}
		},
	},
	files: {
		templates: {
			extension: "twig",
		},
	},
	projectName: "miyagi",
	ui: {
		reload: false,
		theme: {
			favicon: "src/favicon.ico",
			logo: "src/logo.svg",
			navigation: {
				colorBackground: "#eee",
				colorLinks: "#255e8a",
				colorLinksActive: "#fff",
			},
			content: {
				colorHeadlines: "#255e8a",
				colorText: "#234",
			},
		},
	},
};
```
