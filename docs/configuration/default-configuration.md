Please refer to the [available options](/configuration/options/) for a full explanation and possible values.

```js
export default {
	assets: {
		root: "",
		css: [],
		customProperties: {
			files: [],
			prefixes: {
				typo: "typo",
				color: "color",
				spacing: "spacing",
			},
		},
		folder: [],
		js: [],
		manifest: null,
	},
	build: {
		basePath: "/",
		folder: "build",
		outputFile: false,
	},
	components: {
		folder: "src",
		ignores: [
			"node_modules",
			".git",
			"package.json",
			"package-lock.json",
			".miyagi.js",
			".miyagi.mjs",
		],
		lang: "en",
		renderInIframe: {
			default: false,
			except: [],
		},
		textDirection: "ltr",
	},
	engine: {
		render: null,
	},
	extensions: [],
	files: {
		css: {
			name: "index",
			extension: "css",
		},
		js: {
			name: "index",
			extension: "js",
		},
		mocks: {
			name: "mocks",
			extension: ["json", "js"],
		},
		schema: {
			name: "schema",
			extension: "json",
		},
		templates: {
			name: "index",
		},
	},
	namespaces: {},
	projectName: "miyagi",
	ui: {
		reload: true,
		reloadAfterChanges: {
			componentAssets: false,
		},
		textDirection: "ltr",
		theme: {
			css: null,
			favicon: null,
			js: null,
			logo: null,
			mode: "light",
			light: {
				logo: null,
			},
			dark: {
				logo: null,
			},
		},
	},
	schema: {},
};
```
