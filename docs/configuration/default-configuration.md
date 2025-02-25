# Default configuration

Please refer to the [available options](/configuration/options/) for a full explanation and possible values.

```js
import AJV from "ajv";

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
	},
	docs: {
		folder: "docs",
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
		mode: "light",
		lang: "en",
		reload: true,
		reloadAfterChanges: {
			componentAssets: false,
		},
		textDirection: "ltr",
		theme: {
			css: null,
			favicon: null,
			js: null,
			logo: {
				light: null,
				dark: null,
			},
		},
	},
	schema: {
		ajv: AJV,
		options: {},
	},
};
```
