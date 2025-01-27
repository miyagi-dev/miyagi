import AJV from "ajv";

export default {
	defaultUserConfig: {
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
			options: {},
		},
		extensions: [],
		files: {
			css: {
				abbr: "css",
				name: "index",
				extension: "css",
			},
			js: {
				abbr: "js",
				name: "index",
				extension: "js",
			},
			mocks: {
				abbr: "mocks",
				name: "mocks",
				extension: ["json", "js"],
			},
			schema: {
				abbr: "schema",
				name: "schema",
				extension: "json",
			},
			templates: {
				abbr: "tpl",
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
		},
	},
	projectName: "miyagi",
	defaultPort: 5000,
	folders: {
		assets: {
			development: "frontend/assets",
			production: "frontend/assets",
		},
	},
	defaultVariationName: "default",
};
