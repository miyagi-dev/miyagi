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
			outputFile: false,
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
			renderInIframe: {
				default: false,
				except: [],
			},
			textDirection: "ltr",
		},
		engine: {
			render: null,
			name: null,
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
				logo: null,
				light: {
					logo: null,
				},
				dark: {
					logo: null,
				},
			},
		},
		schema: {},
	},
	projectName: "miyagi",
	defaultPort: 5000,
	folders: {
		assets: {
			development: "frontend/assets",
			production: "dist",
		},
	},
	defaultVariationName: "default",
	engines: [
		{
			engine: "dust",
			extension: "dust",
		},
		{
			engine: "ect",
			extension: "ect",
		},
		{
			engine: "ejs",
			extension: "ejs",
		},
		{
			engine: "haml",
			extension: "haml",
		},
		{
			engine: "handlebars",
			extension: "hbs",
		},
		{
			engine: "mustache",
			extension: "mustache",
		},
		{
			engine: "nunjucks",
			extension: "njk",
		},
		{
			engine: "pug",
			extension: "pug",
		},
		{
			engine: "twig",
			extension: "twig",
		},
		{
			engine: "twing",
			extension: "twig",
		},
	],
};
